const fs = require('fs');
const path = require('path');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter() });

fs.readdirSync(path.join(__dirname, 'build'))
  .filter(name => !name.endsWith('.compat.js'))
  .forEach(name => {
    const tests = Object.entries(require(`./build/${name}`));
    for (const [name, suite] of tests) {
      const suiteName = name.replace('default', name.replace('.js', ''));
      const { expected: expectedComponent, actual: assertedComponent, dataSet } = suite;
      describe(suiteName, () => {
        for (const testProps of dataSet) {
          compareInnerHTMLTest({
            ...testProps,
            expectedComponent,
            assertedComponent
          });
        }
      });
    }
  });
