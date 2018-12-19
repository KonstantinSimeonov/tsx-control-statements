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

const CTRL_NODE_NAMES = Object.freeze({
	CONDITIONAL: 'If',
	FOREACH: 'For',
	SWITCH: 'Choose',
	CASE: 'When',
	DEFAULT: 'Otherwise',
	WITH: 'With'
});

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
        .map(x => ({ [x.getChildAt(0).getText()]: x.getChildAt(2) as ts.Expression }));

    return Object.assign({}, ...props);
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

// const trace = <T>(item: T, ...logArgs: any[]) => console.log(item, ...logArgs) || item;
const trim = (from: string) => from.replace(/^\r?\n[\s\t]*/, '').replace(/\r?\n[\s\t]*$/, '');
const nullJsxExpr = () => ts.createJsxExpression(undefined, ts.createNull());

const createExpressionLiteral = (
    expressions: ts.Expression[]
): ts.ArrayLiteralExpression | ts.Expression => expressions.length === 1
            ? ts.createJsxExpression(undefined, expressions[0])
            : ts.createArrayLiteral(expressions);

const transformIfNode: Transformation = (node, program, ctx) => {
    const { condition } = getJsxProps(node);
    if (!condition) {
        console.warn(`tsx-ctrl: ${CTRL_NODE_NAMES.CONDITIONAL} missing condition props`);
        return nullJsxExpr();
    }

    const body = getJsxElementBody(node, program, ctx);

    if (body.length === 0) {
        console.warn(`tsx-ctrl: empty ${CTRL_NODE_NAMES.CONDITIONAL}`);
        return nullJsxExpr();
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
        console.warn(`tsx-ctrl: 'of' property of ${CTRL_NODE_NAMES.FOREACH} is missing`);
        return nullJsxExpr();
    }

    const body = getJsxElementBody(node, program, ctx);
    if (body.length === 0) {
        console.warn(`tsx-ctrl: Empty ${CTRL_NODE_NAMES.FOREACH}`);
        return nullJsxExpr();
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
            ts.createPropertyAccess(ts.createIdentifier('Array'), 'from'),
            undefined,
            [
                of,
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

const transformChooseNode: Transformation = (node, program, ctx) => {
    const elements = node
        .getChildAt(1)
        .getChildren()
        .filter(node => isRelevantJsxNode(node) && [CTRL_NODE_NAMES.CASE, CTRL_NODE_NAMES.DEFAULT].includes(String(getTagNameString(node))))
        .map(node => {
            const tagName = getTagNameString(node);
            const { condition } = getJsxProps(node);
            const nodeBody = getJsxElementBody(node, program, ctx);

            return { condition, nodeBody, tagName };
        })
        .filter((node, index, array) => {
            if (node.nodeBody.length === 0) {
                console.warn(`tsx-ctrl: Empty ${CTRL_NODE_NAMES.CASE}`);
                return false;
            }

            if (!node.condition && node.tagName !== CTRL_NODE_NAMES.DEFAULT) {
                console.warn(`tsx-ctrl: ${CTRL_NODE_NAMES.CASE} without condition will be skipped`);
                return false;
            }

            if (node.tagName === CTRL_NODE_NAMES.DEFAULT && index !== array.length - 1) {
                console.log(`tsx-ctrl: ${CTRL_NODE_NAMES.DEFAULT} must be the last node in a ${CTRL_NODE_NAMES.SWITCH} element!`);
                return false;
            }

            return true;
        });

    if (elements.length === 0) {
        console.warn(`tsx-ctrl: Empty ${CTRL_NODE_NAMES.SWITCH}`);
        return nullJsxExpr();
    }

    const last = elements[elements.length - 1];
    const [cases, defaultCase] = last && last.tagName === CTRL_NODE_NAMES.DEFAULT
                                ? [elements.slice(0, elements.length - 1), last]
                                : [elements, null];
    const defaultCaseOrNull = defaultCase ? createExpressionLiteral(defaultCase.nodeBody) : ts.createNull();

    return ts.createJsxExpression(
        undefined,
        cases.reduceRight(
            (conditionalExpr, { condition, nodeBody }) => ts.createConditional(
                condition,
                createExpressionLiteral(nodeBody),
                conditionalExpr
            ),
            defaultCaseOrNull
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
        case CTRL_NODE_NAMES.CONDITIONAL: return transformIfNode;
        case CTRL_NODE_NAMES.FOREACH: return transformForNode;
        case CTRL_NODE_NAMES.SWITCH: return transformChooseNode;
        case CTRL_NODE_NAMES.WITH: return transformWithNode;
        default: return (a, b, c) => a;
    }
};

const statements: Transformation = (node, program, ctx) => getTransformation(node)(node, program, ctx);

