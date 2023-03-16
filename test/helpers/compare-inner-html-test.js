const { expect } = require('chai');
const enzyme = require('enzyme');
const React = require('react');

module.exports = ({ message, assertedComponent, expectedComponent, props }) =>
  it(message, () => {
    const [expectedNode, actualNode] = [expectedComponent, assertedComponent].map(component =>
      enzyme.mount(React.createElement(component, props)).getDOMNode()
    );

    if (expectedNode !== actualNode) {
      expect(actualNode.innerHTML).to.equal(expectedNode.innerHTML);
    }
  });
