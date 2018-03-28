const { expect } = require('chai');
const Babel = require('./babel/if-child-elements');
const Tsc = require('./tsc/if-child-elements');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter })

const compareInnerHTMLTest = ({
    message,
    tscComponent,
    babelComponent,
    props
}) => it(message, () => {
        const babelWrapper = enzyme.mount(React.createElement(babelComponent, props))
        const tscWrapper = enzyme.mount(React.createElement(tscComponent, props));

        expect(tscWrapper.getDOMNode().innerHTML).to.equal(babelWrapper.getDOMNode().innerHTML);
    });

describe('If', () => {
    describe('renders child elements', () => {
        for (const shouldRenderLinks of [true, false]) {
            compareInnerHTMLTest({
                message: `does ${!shouldRenderLinks ? 'not ' : ''}render child elements when condition={${shouldRenderLinks}}`,
                babelComponent: Babel.IfChildElements,
                tscComponent: Tsc.IfChildElements,
                props: { shouldRenderLinks }
            });
        }
    });

    describe('renders child expressions', () => {
        for (const shouldRenderExpressions of [true, false]) {
            compareInnerHTMLTest({
                message: `does ${!shouldRenderExpressions ? 'not ' : ''}render child expression when condition={${shouldRenderExpressions}}`,
                babelComponent: Babel.IfChildExpressions,
                tscComponent: Tsc.IfChildExpressions,
                props: { a: 3, b: 10, shouldRenderExpressions }
            });
        }
    });

    describe('renders child expressions and elements', () => {
        for (const shouldRender of [true, false]) {
            compareInnerHTMLTest({
                message: `does ${shouldRender ? 'not ' : ''}render child expression and elements when condition={${shouldRender}}`,
                babelComponent: Babel.IfChildExpressionsAndElements,
                tscComponent: Tsc.IfChildExpressionsAndElements,
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
                babelComponent: Babel.IfConditionIsExpressions,
                tscComponent: Tsc.IfConditionIsExpressions,
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
                babelComponent: Babel.NestedIfs,
                tscComponent: Tsc.NestedIfs,
                props: { a, b }
            });
        }
    });

    describe('empty ifs', () => {
        for (const [a, b] of [[1, 1], [1, 2], [2, 1]]) {
            compareInnerHTMLTest({
                message: `works for ${a} ${b}`,
                babelComponent: Babel.EmptyIfs,
                tscComponent: Tsc.EmptyIfs,
                props: { a, b }
            });
            compareInnerHTMLTest({
                message: `works for ${a} ${b}`,
                babelComponent: Babel.EmptyNestedIfs,
                tscComponent: Tsc.EmptyNestedIfs,
                props: { a, b }
            });
        }
    });

    describe('additional props passed', () => {
        for(const condition of [true, false]) {
            compareInnerHTMLTest({
                message: `works when addition props different from 'condition' are passed and condition={${condition}}`,
                babelComponent: Babel.IfMultipleProps,
                tscComponent: Tsc.IfMultipleProps,
                props: { condition }
            });
        }
    })
});
