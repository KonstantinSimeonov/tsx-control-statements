const Babel = require('./babel/if-child-elements');
const Tsc = require('./tsc/if-child-elements');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

describe('If', () => {
    describe('renders child elements', () => {
        for (const shouldRenderLinks of [true, false]) {
            compareInnerHTMLTest({
                message: `does ${!shouldRenderLinks ? 'not ' : ''}render child elements when condition={${shouldRenderLinks}}`,
                expectedComponent: Babel.IfChildElements,
                assertedComponent: Tsc.IfChildElements,
                props: { shouldRenderLinks }
            });
        }
    });

    describe('renders child expressions', () => {
        for (const shouldRenderExpressions of [true, false]) {
            compareInnerHTMLTest({
                message: `does ${!shouldRenderExpressions ? 'not ' : ''}render child expression when condition={${shouldRenderExpressions}}`,
                expectedComponent: Babel.IfChildExpressions,
                assertedComponent: Tsc.IfChildExpressions,
                props: { a: 3, b: 10, shouldRenderExpressions }
            });
        }
    });

    describe('renders child expressions and elements', () => {
        for (const shouldRender of [true, false]) {
            compareInnerHTMLTest({
                message: `does ${shouldRender ? 'not ' : ''}render child expression and elements when condition={${shouldRender}}`,
                expectedComponent: Babel.IfChildExpressionsAndElements,
                assertedComponent: Tsc.IfChildExpressionsAndElements,
                props: { a: 3, b: 4, shouldRenderStuff: shouldRender }
            });
        }
    });

    describe('complex boolean expressions', () => {
        const names = [
            ['gery', 'nikol'],
            ['gosho', 'gosho'],
            ['', 'tosho'],
            ['', ''],
            ['zdr', '']
        ];

        for (const [name1, name2] of names) {
            compareInnerHTMLTest({
                message: `works for ${name1} ${name2}`,
                expectedComponent: Babel.IfConditionIsExpressions,
                assertedComponent: Tsc.IfConditionIsExpressions,
                props: { name1, name2 }
            });
        }
    });

    describe('nested ifs', () => {
        for (const [a, b] of [
            [1, 1],
            [1, 2]
        ]) {
            compareInnerHTMLTest({
                message: `works for ${a} ${b}`,
                expectedComponent: Babel.NestedIfs,
                assertedComponent: Tsc.NestedIfs,
                props: { a, b }
            });
        }
    });

    describe('empty ifs', () => {
        for (const [a, b] of [[1, 1], [1, 2], [2, 1]]) {
            compareInnerHTMLTest({
                message: `works for ${a} ${b}`,
                expectedComponent: Babel.EmptyIfs,
                assertedComponent: Tsc.EmptyIfs,
                props: { a, b }
            });
            compareInnerHTMLTest({
                message: `works for ${a} ${b}`,
                expectedComponent: Babel.EmptyNestedIfs,
                assertedComponent: Tsc.EmptyNestedIfs,
                props: { a, b }
            });
        }
    });

    describe('additional props passed', () => {
        for(const condition of [true, false]) {
            compareInnerHTMLTest({
                message: `works when addition props different from 'condition' are passed and condition={${condition}}`,
                expectedComponent: Babel.IfMultipleProps,
                assertedComponent: Tsc.IfMultipleProps,
                props: { condition }
            });
        }
    })
});
