const fs = require(`fs`);
const path = require(`path`);
const compareInnerHTMLTest = require(`./helpers/compare-inner-html-test`);

const testFiles = fs.readdirSync(path.join(__dirname, `babel`));

for (const name of testFiles) {
  /** @type {Object.<string, { component: React.FC, dataSet: { props: object }[] }} */
  const babelTests = require(`./babel/${name}`);

  /** @type {Object.<string, { component: React.FC, dataSet: { props: object }[] }} */
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
