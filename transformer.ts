import * as ts from 'typescript';

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => (file: ts.SourceFile) => visitNodes(file, program, context);
}

function visitNodes(file: ts.SourceFile, program: ts.Program, context: ts.TransformationContext): ts.SourceFile;
function visitNodes(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node;

function visitNodes(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node {
    const newNode = statements(node, program, context);
    if (node !== newNode) {
        return newNode;
    }

    return ts.visitEachChild(node, childNode => visitNodes(childNode, program, context), context);
}

type Transformation = (node: ts.Node, program: ts.Program, context: ts.TransformationContext) => ts.Node;

const CONTROL_STATEMENT_TAG_NAMES = ['If'];
const isControlStatementNode = (node: ts.Node): boolean => {
    return ts.isJsxOpeningElement(node) && CONTROL_STATEMENT_TAG_NAMES.indexOf(
        (node as ts.JsxOpeningElement).tagName.getFullText()
    ) !== -1;
};

const getChildren = (node: ts.Node): ts.Node[] => node.getChildren().slice(1, node.getChildCount() - 1);

function* elems(node: ts.Node): Iterable<ts.Node> {
    yield node;
    for (const cn of node.getChildren()) {
        yield* elems(cn);
    }
}

const filter = <T>(predicate: (item: T) => boolean) => function* (iterable: Iterable<T>): Iterable<T> {
    for (const item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
};

const getConditionNode = (node: ts.Node): ts.Expression | null => {
    const [result] = filter((n: ts.Node) => ts.isJsxAttribute(n) && n.name.getText() === 'condition')(elems(node));
    return result.getChildAt(2) as ts.Expression;
};
const trace = <T>(item: T, ...logArgs: any[]) => console.log(item, ...logArgs) || item;
const trim = (from: string) => from.replace(/^\r?\n[\s\t]*/, '').replace(/\r?\n[\s\t]*$/, '');

const transformIfNode: Transformation = (node, program, ctx) => {
    const openingElement = node.getChildAt(0);
    const cnd = getConditionNode(openingElement);
    if (cnd == null) {
        console.warn('tsx-ctrl: If missing condition props');
        return node;
    }

    const ifStatementBody = getChildren(node);
    const arr = ifStatementBody[0]
        .getChildren()
        .filter(
        node => ts.isJsxElement(node)
            || ts.isJsxExpression(node)
            || ts.isJsxText(node)
        ).map(
        node => {
            if (ts.isJsxText(node)) {
                const text = trim(node.getFullText());
                return text ? ts.createLiteral(text) : null;
            }
            return visitNodes(node, program, ctx);
        }).filter(Boolean) as ts.Expression[];

    if (arr.length === 0) {
        console.warn('tsx-ctrl: empty If');
        return ts.createNull();
    }

    return ts.createJsxExpression(
        undefined,
        ts.createConditional(
            cnd.getChildAt(1) as ts.Expression,
            arr.length !== 1 ?
                ts.createArrayLiteral(arr)
                : ts.createJsxExpression(ts.createToken(ts.SyntaxKind.DotDotDotToken), arr[0])
            ,
            ts.createNull()
        )
    )
}

const getForProps = (node: ts.Node) => {
    const maybeOpeningElement = node.getChildAt(0);
    if (!ts.isJsxOpeningElement(maybeOpeningElement)) {
        return { each: null, index: null, of: null };
    }

    const propNames = new Set(['each', 'of', 'index']);
    const props = maybeOpeningElement // attributes are children of the opening element
        .getChildAt(2) // [tag (<), name (For), attributes (...), tag (>)]
        .getChildAt(0) // some kinda ts api derp
        .getChildren()
        .filter(x => ts.isJsxAttribute(x) && propNames.has(x.getChildAt(0).getText()))
        .map(x => ({ [x.getChildAt(0).getText()]: x.getChildAt(2) }))
        .reduce((m, c) => Object.assign(m, c), {});

    const { each, index, of } = props;
    return { each, index, of };
};

const transformForNode: Transformation = (node, program, ctx) => {
    const { each, of, index } = getForProps(node);
    trace(
        [each, of, index].map(x => x && x.getFullText())
    );

    if (!each || !index || !of) {
        return ts.createNull();
    }

    const body = node
        .getChildAt(1)
        .getChildren()
        .filter(
        node => ts.isJsxElement(node)
            || ts.isJsxExpression(node)
            || ts.isJsxText(node) && node.getText() !== ''
        );
    trace(body.map(n => n.getFullText()));
    if (body.length === 0) {
        trace('kek');
        return ts.createNull();
    }

    return ts.createJsxExpression(
        undefined,
        ts.createCall(
            ts.createPropertyAccess(
                of as ts.Expression,
                'map'
            ),
            undefined,
            [
                ts.createArrowFunction(
                    undefined,
                    undefined,
                    [
                        ts.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            each.getText().slice(1, -1)
                        ),
                        ts.createParameter(
                            undefined,
                            undefined,
                            undefined,
                            index.getText().slice(1, -1)
                        )
                    ],
                    undefined, // type
                    undefined,
                    ts.createBlock([
                        ts.createReturn(
                            ts.createArrayLiteral(body as ts.Expression[])
                        )
                    ])
                )
            ]
        )
    );
};

const getTransformation = (node: ts.Node): Transformation => {
    if (!ts.isJsxElement(node)) {
        return (a, b, c) => a;
    }

    const openingElement = node.getChildAt(0);
    const tagName = ts.isJsxOpeningElement(openingElement) && openingElement.tagName.getText();

    switch (tagName) {
        case 'If': return transformIfNode;
        case 'For': return transformForNode;
        default: return (a, b, c) => a;
    }
}

const statements: Transformation = (node, program, ctx) => getTransformation(node)(node, program, ctx);
