const { expect } = require('chai');
const enzyme = require('enzyme');
const React = require('react');

module.exports = ({
    message,
    assertedComponent,
    expectedComponent,
    props
}) => it(message, () => {
        const babelWrapper = enzyme.mount(React.createElement(expectedComponent, props))
        const tscWrapper = enzyme.mount(React.createElement(assertedComponent, props));

        expect(tscWrapper.getDOMNode().innerHTML).to.equal(babelWrapper.getDOMNode().innerHTML);
    });