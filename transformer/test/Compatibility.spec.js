const fs = require('fs');
const path = require('path');

const Babel = require('./babel/choose');
const Tsc = require('./tsc/choose');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

const testFiles = fs.readdirSync(path.join(__dirname, 'babel'));
const zip = (xs, ys, fn) => Array
                                .from({ length: Math.min(xs.length, ys.length) })
                                .map((_, index) => fn(xs[index], ys[index], index));

zip(
    testFiles.map(fileName => [fileName, `./babel/${fileName}`]),
    testFiles.map(fileName => `./tsc/${fileName}`),
    (babelPath, tscPath) => [babelPath[0], require(babelPath[1]), require(tscPath)]
).forEach(([fileName, BabelComponents, TscComponents]) => {
    describe(
        fileName,
        () => {
            const suitNames = Object.keys(BabelComponents);
            const suites = suitNames.map(suiteName => {
                const babelComponent = BabelComponents[suiteName].component;
                const { component: tscComponent, dataSet } = TscComponents[suiteName];
                return [suiteName, babelComponent, tscComponent, dataSet];
            });

            for (const [suiteName, expectedComponent, assertedComponent, dataSet] of suites) {
                dataSet
                    .map(testProps => Object.assign({ expectedComponent, assertedComponent }, testProps))
                    .forEach(compareInnerHTMLTest)
            }
        }
    )
});
