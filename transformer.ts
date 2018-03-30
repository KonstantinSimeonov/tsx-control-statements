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

const getTagNameString = (node: ts.Node): string | null => {
    const maybeOpeningElement = node.getChildAt(0);

    if (!ts.isJsxOpeningElement(maybeOpeningElement)) {
        return null;
    }

    return maybeOpeningElement.tagName.getFullText();
};

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
        .filter(ts.isJsxAttribute)
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
            trace(getTagNameString(node));
            return visitNodes(node, program, ctx);
        }
    ).filter(Boolean) as ts.Expression[];

const trace = <T>(item: T, ...logArgs: any[]) => console.log(item, ...logArgs) || item;
const trim = (from: string) => from.replace(/^\r?\n[\s\t]*/, '').replace(/\r?\n[\s\t]*$/, '');

const createExpressionLiteral =
    (
        expressions: ts.Expression[]
    ): ts.ArrayLiteralExpression | ts.Expression => expressions.length === 1
            ? ts.createJsxExpression(undefined, expressions[0])
            : ts.createArrayLiteral(expressions);

const transformIfNode: Transformation = (node, program, ctx) => {
    const { condition } = getJsxProps(node);
    if (!condition) {
        console.warn('tsx-ctrl: If missing condition props');
        return ts.createNull();
    }

    const body = getJsxElementBody(node, program, ctx);

    if (body.length === 0) {
        console.warn('tsx-ctrl: empty If');
        return ts.createNull();
    }

    return ts.createJsxExpression(
        undefined,
        ts.createConditional(
            condition,
            createExpressionLiteral(body),
            ts.createNull()
        )
    )
}

const transformForNode: Transformation = (node, program, ctx) => {
    const { each, of, index } = getJsxProps(node);
    if (!of) {
        return ts.createNull();
    }

    const body = getJsxElementBody(node, program, ctx);
    if (body.length === 0) {
        return ts.createNull();
    }

    const arrowFunctionArgs =
        [each, index].map(
            arg => arg && ts.createParameter(
                undefined,
                undefined,
                undefined,
                arg.getText().slice(1, -1)
            )
        ).filter(Boolean);

    return ts.createJsxExpression(
        undefined,
        ts.createCall(
            ts.createPropertyAccess(of, 'map'),
            undefined,
            [
                ts.createArrowFunction(
                    undefined,
                    undefined,
                    arrowFunctionArgs,
                    undefined, // type
                    undefined,
                    createExpressionLiteral(body)
                )
            ]
        )
    );
};

const transformOtherwiseNode: Transformation = (node, program, ctx) => createExpressionLiteral(getJsxElementBody(node, program, ctx));

const transformWhenNode: Transformation = (node, program, ctx) => {
    const { condition } = getJsxProps(node);
    if(!condition) return ts.createNull();
    return ts.createConditional(
        condition,
        createExpressionLiteral(getJsxElementBody(node, program, ctx)),
        ts.createNull()
    )
};

const transformChooseNode: Transformation = (node, program, ctx) => {
    trace('kek')
    const elements = getJsxElementBody(node, program, ctx);
    return ts.createJsxExpression(
        undefined,
        ts.createCall(
            ts.createPropertyAccess(
                ts.createArrayLiteral(elements),
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
    const iifeArgs = Object.keys(props).map(key => ts.createParameter(undefined, undefined, undefined, key));
    const iifeArgValues = Object.values(props);
    const body = getJsxElementBody(node, program, ctx) as ts.Expression[];

    return ts.createJsxExpression(
        undefined,
        ts.createCall(
            ts.createArrowFunction(
                undefined,
                undefined,
                iifeArgs,
                undefined,
                undefined,
                createExpressionLiteral(body)
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

    const tagName = getTagNameString(node);
    switch (tagName) {
        case 'If': return transformIfNode;
        case 'For': return transformForNode;
        case 'Choose': return transformChooseNode;
        case 'Otherwise': return transformOtherwiseNode;
        case 'When': return transformWhenNode;
        case 'With': return transformWithNode;
        default: return (a, b, c) => a;
    }
};

const statements: Transformation = (node, program, ctx) => getTransformation(node)(node, program, ctx);
