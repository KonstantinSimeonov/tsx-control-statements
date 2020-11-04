const fs = require('fs');
const path = require('path');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter() });

fs.readdirSync(path.join(__dirname, 'tsx-cases'))
  .filter(fileName => fileName.endsWith('.js'))
  .map(fileName => [fileName, Object.entries(require(`./tsx-cases/${fileName}`))])
  .forEach(([fileName, fileExports]) => {
    const testSuites = fileExports.filter(([, fileExport]) => typeof fileExport === 'object');
    for (const [name, suite] of testSuites) {
      const suiteName = name.replace('default', fileName.replace('.js', ''));
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
