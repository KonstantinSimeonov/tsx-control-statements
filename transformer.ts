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

const isRelevantJsxNode = (node: ts.Node): boolean => ts.isJsxElement(node)
    || ts.isJsxExpression(node)
    || ts.isJsxText(node) && node.getText() !== '';

const getConditionNode = (node: ts.Node): ts.Expression | null => {
    const [result] = filter((n: ts.Node) => ts.isJsxAttribute(n) && n.name.getText() === 'condition')(elems(node));
    if (result) {
        return result.getChildAt(2) as ts.Expression;
    }

    return null;
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

    const ifStatementBody = node.getChildren().slice(1, -1);
    const arr = ifStatementBody[0]
        .getChildren()
        .filter(isRelevantJsxNode)
        .map(
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

    if (!each || !index || !of) {
        return ts.createNull();
    }

    const body = node
        .getChildAt(1)
        .getChildren()
        .filter(isRelevantJsxNode);
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

const transformChooseNode: Transformation = (node, program, ctx) => {
    const body = node.getChildAt(1).getChildren();
    const elements = body.filter(ts.isJsxElement).map(
        node => {
            const maybeOpeningElement = node.getChildAt(0);
            const conditionNode = getConditionNode(maybeOpeningElement);
            const nodeBody = node.getChildAt(1).getChildren().filter(isRelevantJsxNode).map(
                node => {
                    if (ts.isJsxText(node)) {
                        const text = trim(node.getFullText());
                        return text ? ts.createLiteral(text) : null;
                    }
                    return visitNodes(node, program, ctx);
                }).filter(Boolean) as ts.Expression[];;
            if (!conditionNode) {
                trace('it is kek');
                if (ts.isJsxOpeningElement(maybeOpeningElement) && maybeOpeningElement.tagName.getText() === 'Otherwise') {
                    return ts.createArrayLiteral(nodeBody as ts.Expression[]);
                }

                return null;
            }
            return ts.createConditional(
                conditionNode as ts.Expression,
                ts.createArrayLiteral(nodeBody as ts.Expression[]),
                ts.createNull()
            )
        }
    );

    return ts.createJsxExpression(
        undefined,
        ts.createCall(
            ts.createPropertyAccess(
                ts.createArrayLiteral(elements as ts.Expression[]),
                'find'
            ),
            undefined,
            [
                ts.createIdentifier('Boolean')
            ]
        )
    );
};

type BindingsMap = { string?: ts.Expression };
const getWithProps = (node: ts.Node): BindingsMap => {
    const child = node.getChildAt(0);
    if(!ts.isJsxOpeningElement(child)) {
        return {} as BindingsMap;
    }

    const props = child
                    .getChildAt(2) // [tag (<), name (For), attributes (...), tag (>)]
                    .getChildAt(0) // some kinda ts api derp
                    .getChildren()
                    .filter(x => ts.isJsxAttribute(x))
                    .map(x => ({ [x.getChildAt(0).getText()]: x.getChildAt(2) }))
                    .reduce((m, c) => Object.assign(m, c), {});

    return props;
};

const transformWithNode: Transformation = (node, program, ctx) => {

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
        case 'Choose': return transformChooseNode;
        default: return (a, b, c) => a;
    }
}

const statements: Transformation = (node, program, ctx) => getTransformation(node)(node, program, ctx);
