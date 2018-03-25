const { expect } = require('chai');
const Babel = require('./babel/if-child-elements');
const Tsc = require('./tsc/if-child-elements');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
enzyme.configure({ adapter: new Adapter() })

describe('If', () => {
    describe('renders child elements', () => {
        for(const shouldRender of [true, false]) {
            it(`does ${shouldRender ? 'not ' : ''} render child elements when condition={${shouldRender}}`, () => {
                const babelWrapper = enzyme.mount(React.createElement(Babel.IfChildElements, { shouldRenderLinks: shouldRender }));
                const tscWrapper = enzyme.mount(React.createElement(Tsc.IfChildElements, { shouldRenderLinks: shouldRender }));

                expect(babelWrapper.getDOMNode().innerHTML).to.equal(tscWrapper.getDOMNode().innerHTML);
            });
        }
    });
    describe('renders child expressions', () => {
        describe('renders child expressions', () => {
            for(const shouldRender of [true, false]) {
                it(`does ${shouldRender ? 'not ' : ''} render child expression when condition={${shouldRender}}`);
            }
        });
    });
});