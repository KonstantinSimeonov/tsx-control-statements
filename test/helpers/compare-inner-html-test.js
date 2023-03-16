const { expect } = require('chai');
const React = require('react');
const { render } = require(`@testing-library/react`);

/**
 * @description
 * Renders the provided components with the given props
 * and asserts that they produce equal html.
 *
 * @param {{ message: string, assertedComponent: React.FC, expectedComponent: React.FC, props: object }} args
 */
const compareInnerHTMLTest = ({ message, assertedComponent, expectedComponent, props }) =>
  it(message, () => {
    const [expectedNode, actualNode] = [expectedComponent, assertedComponent].map(
      component => render(React.createElement(component, props)).baseElement
    );

    if (expectedNode !== actualNode) {
      expect(actualNode.innerHTML).to.equal(expectedNode.innerHTML);
    }
  });

module.exports = compareInnerHTMLTest
