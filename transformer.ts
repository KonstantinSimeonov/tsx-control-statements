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

type Transformation = (node: ts.Node, program: ts.Program, context: ts.TransformationContext) => Readonly<ts.Node>;
const isRelevantJsxNode = (node: ts.Node): boolean => ts.isJsxElement(node)
    || ts.isJsxExpression(node)
    || ts.isJsxText(node) && node.getText() !== '';

type PropMap = Readonly<ts.MapLike<ts.Expression>>;
const getJsxProps = (node: ts.Node): PropMap => {
    const child = node.getChildAt(0);
    if (!ts.isJsxOpeningElement(child)) {
        return {} as PropMap;
    }

    const props = child
        .getChildAt(2) // [tag (<), name (For, If, etc), attributes (...), tag (>)]
        .getChildAt(0) // some kinda ts api derp
        .getChildren()
        .filter(x => ts.isJsxAttribute(x))
        .map(x => ({ [x.getChildAt(0).getText()]: x.getChildAt(2) as ts.Expression }))
        .reduce((m, c) => Object.assign(m, c), {});

    return props;
};

const getJsxElementBody = (
    node: ts.Node,
    program: ts.Program,
    ctx: ts.TransformationContext
): ts.Expression[] => node.getChildAt(1)
    .getChildren()
    .filter(isRelevantJsxNode)
    .map(
        node => {
            if (ts.isJsxText(node)) {
                const text = trim(node.getFullText());
                return text ? ts.createLiteral(text) : null;
            }

            return visitNodes(node, program, ctx);
        }
    ).filter(Boolean) as ts.Expression[];

const trace = <T>(item: T, ...logArgs: any[]) => console.log(item, ...logArgs) || item;
const trim = (from: string) => from.replace(/^\r?\n[\s\t]*/, '').replace(/\r?\n[\s\t]*$/, '');

const transformIfNode: Transformation = (node, program, ctx) => {
    const { condition } = getJsxProps(node);
    if (condition == null) {
        console.warn('tsx-ctrl: If missing condition props');
        return node;
    }

    const body = getJsxElementBody(node, program, ctx);

    if (body.length === 0) {
        console.warn('tsx-ctrl: empty If');
        return ts.createNull();
    }

    return ts.createJsxExpression(
        undefined,
        ts.createConditional(
            condition.getChildAt(1) as ts.Expression,
            body.length !== 1 ?
                ts.createArrayLiteral(body)
                : ts.createJsxExpression(ts.createToken(ts.SyntaxKind.DotDotDotToken), body[0])
            ,
            ts.createNull()
        )
    )
}

const transformForNode: Transformation = (node, program, ctx) => {
    const { each, of, index } = getJsxProps(node);

    if (!each || !index || !of) {
        return ts.createNull();
    }

    const body = getJsxElementBody(node, program, ctx);

    if (body.length === 0) {
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
                            ts.createArrayLiteral(body)
                        )
                    ])
                )
            ]
        )
    );
};

const transformChooseNode: Transformation = (node, program, ctx) => {
    const body = node.getChildAt(1).getChildren();
    const elements = body.filter(isRelevantJsxNode).map(
        node => {
            const maybeOpeningElement = node.getChildAt(0);
            const { condition } = getJsxProps(node);
            const body = getJsxElementBody(node, program, ctx);
            if (!condition) {
                if (ts.isJsxOpeningElement(maybeOpeningElement) && maybeOpeningElement.tagName.getText() === 'Otherwise') {
                    return ts.createArrayLiteral(body);
                }

                return null;
            }
            return ts.createConditional(
                condition as ts.Expression,
                ts.createArrayLiteral(body),
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

const transformWithNode: Transformation = (node, program, ctx) => {
    const props = getJsxProps(node);
    const body = getJsxElementBody(node, program, ctx) as ts.Expression[];
    const iifeArgs = Object.keys(props).map(key => ts.createParameter(undefined, undefined, undefined, key));
    const iifeArgValues = Object.values(props).map(valueNode => valueNode.getChildAt(1)) as ts.Expression[];

    return ts.createJsxExpression(
        undefined,
        ts.createCall(
            ts.createArrowFunction(
                undefined,
                undefined,
                iifeArgs,
                undefined,
                undefined,
                ts.createBlock([
                    ts.createReturn(
                        ts.createArrayLiteral(body)
                    )
                ])
            ),
            undefined,
            iifeArgValues
        )
    );
};

const getTransformation = (node: ts.Node): Transformation => {
    if (!ts.isJsxElement(node)) {
        return (a, b, c) => a;
    }

    const openingElement = node.getChildAt(0);
    const tagName = ts.isJsxOpeningElement(openingElement) ? openingElement.tagName.getText() : '';
    switch (tagName) {
        case 'If': return transformIfNode;
        case 'For': return transformForNode;
        case 'Choose': return transformChooseNode;
        case 'With': return transformWithNode;
        default: return (a, b, c) => a;
    }
};

const statements: Transformation = (node, program, ctx) => getTransformation(node)(node, program, ctx);
