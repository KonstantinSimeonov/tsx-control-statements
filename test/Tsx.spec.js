const fs = require(`fs`);
const path = require(`path`);
const compareInnerHTMLTest = require(`./helpers/compare-inner-html-test`);

fs.readdirSync(path.join(__dirname, `build`))
  .filter(name => !name.endsWith(`.compat.js`))
  .forEach(name => {
    const tests = Object.entries(require(`./build/${name}`));
    for (const [name, suite] of tests) {
      const suiteName = name.replace(`default`, name.replace(`.js`, ``));
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
