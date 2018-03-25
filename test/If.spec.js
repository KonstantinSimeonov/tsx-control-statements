const { expect } = require('chai');
const Babel = require('./babel/if-child-elements');
const Tsc = require('./tsc/if-child-elements');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
console.log(React);
enzyme.configure({ adapter: new Adapter() })

describe('If', () => {
    describe('renders child elements', () => {
        for(const shouldRender of [true, false]) {
            it(`does ${shouldRender ? 'not ' : ''} render child elements when condition={${shouldRender}}`, () => {
                const babelWrapper = enzyme.shallow(React.createElement(Babel.IfChildElements, { shouldRenderLinks: shouldRender }));
                const tscWrapper = enzyme.shallow(React.createElement(Tsc.IfChildElements, { shouldRenderLinks: shouldRender }));

                expect(babelWrapper.find('a')).to.have.lengthOf(shouldRender ? 2 : 0, 'babel fail');
                expect(tscWrapper.find('a')).to.have.lengthOf(shouldRender ? 2 : 0, 'tsc fail');
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