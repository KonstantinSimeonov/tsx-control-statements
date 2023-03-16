const fs = require('fs');
const path = require('path');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter() });

const testFiles = fs.readdirSync(path.join(__dirname, 'babel'));

for (const name of testFiles) {
  const babelTests = require(`./babel/${name}`);
  const tscTests = require(`./build/${name}`);
  const suiteNames = Object.keys(babelTests);
  for (const suiteName of suiteNames) {
    const expectedComponent = babelTests[suiteName].component;
    const { component: assertedComponent, dataSet } = tscTests[suiteName];
    describe(suiteName, () =>
      dataSet.forEach(testProps =>
        compareInnerHTMLTest({ expectedComponent, assertedComponent, ...testProps })
      )
    );
  }
}
