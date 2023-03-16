const { expect } = require('chai');
const React = require('react');
const { render } = require(`@testing-library/react`)

module.exports = ({ message, assertedComponent, expectedComponent, props }) =>
  it(message, () => {
    const [expectedNode, actualNode] = [expectedComponent, assertedComponent].map(component =>
      render(React.createElement(component, props)).baseElement
    );

    if (expectedNode !== actualNode) {
      expect(actualNode.innerHTML).to.equal(expectedNode.innerHTML);
    }
  });
