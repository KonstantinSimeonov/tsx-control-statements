import * as ts from 'typescript';

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => (file: ts.SourceFile) =>
    visitNodes(file, program, context);
}

function visitNodes(
  file: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext
): ts.SourceFile;
function visitNodes(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node;

function visitNodes(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext
): ts.Node {
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

type TS<N, R = ts.Node> = (
  node: N,
  program: ts.Program,
  context: ts.TransformationContext
) => Readonly<R>;

type Transformation = TS<ts.Node>;
type JsxTransformation = TS<ts.JsxElement>;

const isRelevantJsxNode = (node: ts.Node): node is ts.JsxElement =>
  ts.isJsxElement(node) ||
  ts.isJsxSelfClosingElement(node) ||
  ts.isJsxExpression(node) ||
  (ts.isJsxText(node) && node.getText() !== '');

const getTagNameString = (node: ts.JsxElement | ts.JsxSelfClosingElement): string => {
  if (ts.isJsxSelfClosingElement(node)) {
    return node.tagName.getFullText();
  }

  const maybeOpeningElement = node.getChildAt(0) as ts.JsxOpeningElement;
  return maybeOpeningElement.tagName.getFullText();
};

type PropMap = Readonly<ts.MapLike<ts.Expression>>;
const getJsxProps = (node: ts.JsxElement): PropMap => {
  const isOpening = ts.isJsxOpeningElement(node.getChildAt(0));
  const elementWithProps = isOpening ? node.getChildAt(0) : node;

  const props = elementWithProps
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
): ts.JsxChild[] =>
  node
    .getChildAt(1)
    .getChildren()
    .filter(isRelevantJsxNode)
    .map(node => (ts.isJsxText(node) ? node : (visitNodes(node, program, ctx) as ts.JsxChild)))
    .filter(Boolean);

const trim = (from: string) => from.replace(/^\r?\n[\s\t]*/, '').replace(/\r?\n[\s\t]*$/, '');
const nullJsxExpr = (): ts.JsxChild => ts.factory.createJsxExpression(undefined, ts.factory.createNull());

const hasOnlyComments = (expr: ts.JsxExpression) => {
  let onlyComments = true;
  expr.forEachChild(
    c =>
      (onlyComments =
        onlyComments &&
        [
          ts.SyntaxKind.LastPunctuation,
          ts.SyntaxKind.FirstPunctuation,
          ts.SyntaxKind.CloseBraceToken
        ].includes(c.kind))
  );
  return onlyComments;
};

const createExpressionLiteral = (
  expressions: ts.JsxChild[],
  node: ts.Node
): ts.JsxFragment | ts.Expression => {
  if (expressions.length === 1) {
    const [expr] = expressions;
    if (ts.isJsxExpression(expr) && hasOnlyComments(expr)) {
      return ts.factory.createNull();
    }
    const jsxChild = ts.isJsxText(expr) ? ts.factory.createStringLiteral(trim(expr.getFullText())) : expr;
    return jsxChild;
  }

  return ts.factory.createJsxFragment(
    ts.setOriginalNode(ts.factory.createJsxOpeningFragment(), node),
    expressions,
    ts.setOriginalNode(ts.factory.createJsxJsxClosingFragment(), node)
  );
};

const transformIfNode: JsxTransformation = (node, program, ctx) => {
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

  return ts.factory.createJsxExpression(
    undefined,
    ts.createConditional(condition, createExpressionLiteral(body, node), ts.factory.createNull())
  );
};

const makeArrayFromCall = (args: ts.Expression[]): ts.JsxExpression =>
  ts.factory.createJsxExpression(
    undefined,
    ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Array'), 'from'), undefined, args)
  );

const transformForNode: JsxTransformation = (node, program, ctx) => {
  const { each, of, index, body: functionLoopBody } = getJsxProps(node);
  if (!of) {
    console.warn(`tsx-ctrl: 'of' property of ${CTRL_NODE_NAMES.FOREACH} is missing`);
    return nullJsxExpr();
  }

  if (functionLoopBody) {
    // {body} - brackets are children 0 and 2, body is between
    const func = functionLoopBody.getChildAt(1);
    if (ts.isArrowFunction(func) || ts.isFunctionExpression(func)) {
      const transformedFunc = visitNodes(func, program, ctx) as ts.FunctionExpression;
      return makeArrayFromCall([of, transformedFunc]);
    }
  }

  const body = getJsxElementBody(node, program, ctx);
  if (body.length === 0) {
    console.warn(`tsx-ctrl: Empty ${CTRL_NODE_NAMES.FOREACH}`);
    return nullJsxExpr();
  }

  const arrowFunctionArgs = [each, index]
    .map(
      arg => arg && ts.createParameter(undefined, undefined, undefined, arg.getText().slice(1, -1))
    )
    .filter(Boolean);

  const arrowFunction = ts.createArrowFunction(
    undefined,
    undefined,
    arrowFunctionArgs,
    undefined, // type
    undefined,
    createExpressionLiteral(body, node)
  );

  return makeArrayFromCall([of, arrowFunction]);
};

const CHOOSE_TAG_NAMES: readonly string[] = [CTRL_NODE_NAMES.CASE, CTRL_NODE_NAMES.DEFAULT]

const transformChooseNode: JsxTransformation = (node, program, ctx) => {
  const elements = (node
    .getChildAt(1)
    .getChildren()
    .filter(
      node =>
        isRelevantJsxNode(node) &&
        CHOOSE_TAG_NAMES.includes(getTagNameString(node))
    ) as ts.JsxElement[])
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
        console.log(
          `tsx-ctrl: ${CTRL_NODE_NAMES.DEFAULT} must be the last node in a ${CTRL_NODE_NAMES.SWITCH} element!`
        );
        return false;
      }

      return true;
    });

  if (elements.length === 0) {
    console.warn(`tsx-ctrl: Empty ${CTRL_NODE_NAMES.SWITCH}`);
    return nullJsxExpr();
  }

  const last = elements[elements.length - 1];
  const [cases, defaultCase] =
    last && last.tagName === CTRL_NODE_NAMES.DEFAULT
      ? [elements.slice(0, elements.length - 1), last]
      : [elements, null];
  const defaultCaseOrNull = defaultCase
    ? createExpressionLiteral(defaultCase.nodeBody, node)
    : ts.factory.createNull()

  return ts.factory.createJsxExpression(
    undefined,
    cases.reduceRight(
      (conditionalExpr, { condition, nodeBody }) =>
        ts.createConditional(condition, createExpressionLiteral(nodeBody, node), conditionalExpr),
      defaultCaseOrNull
    )
  );
};

const transformWithNode: JsxTransformation = (node, program, ctx) => {
  const props = getJsxProps(node);
  const iifeArgs = Object.keys(props).map(key =>
    ts.factory.createParameterDeclaration(undefined, undefined, key)
  );
  const iifeArgValues = Object.values(props);
  const body = getJsxElementBody(node, program, ctx);

  return ts.factory.createJsxExpression(
    undefined,
    ts.createCall(
      ts.createArrowFunction(
        undefined,
        undefined,
        iifeArgs,
        undefined,
        undefined,
        createExpressionLiteral(body, node)
      ),
      undefined,
      iifeArgValues
    )
  );
};

const STUB_PACKAGE_REGEXP = /("|')tsx-control-statements\/components(.ts)?("|')/;
const getTransformation = (node: ts.Node): JsxTransformation => {
  const isStubsImport =
    ts.isImportDeclaration(node) &&
    node.getChildren().some(child => STUB_PACKAGE_REGEXP.test(child.getFullText()));

  if (isStubsImport) {
    return ts.factory.createEmptyStatement
  }

  if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) {
    return node => node;
  }

  const tagName = getTagNameString(node as ts.JsxElement);
  switch (tagName) {
    case CTRL_NODE_NAMES.CONDITIONAL:
      return transformIfNode;
    case CTRL_NODE_NAMES.FOREACH:
      return transformForNode;
    case CTRL_NODE_NAMES.SWITCH:
      return transformChooseNode;
    case CTRL_NODE_NAMES.WITH:
      return transformWithNode;
    default:
      return node => node;
  }
};

const statements: Transformation = (node, program, ctx) =>
  (getTransformation(node) as Transformation)(node, program, ctx);
