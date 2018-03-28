const { expect } = require('chai');
const enzyme = require('enzyme');
const React = require('react');

module.exports = ({
    message,
    tscComponent,
    babelComponent,
    props
}) => it(message, () => {
        const babelWrapper = enzyme.mount(React.createElement(babelComponent, props))
        const tscWrapper = enzyme.mount(React.createElement(tscComponent, props));

        expect(tscWrapper.getDOMNode().innerHTML).to.equal(babelWrapper.getDOMNode().innerHTML);
    });