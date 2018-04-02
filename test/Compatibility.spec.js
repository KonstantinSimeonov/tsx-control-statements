const fs = require('fs');

const Babel = require('./babel/choose');
const Tsc = require('./tsc/choose');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

const testFiles = fs.readdirSync('./babel').filter(x => !x[1].endsWith('if.js'));
const zip = (xs, ys, fn) => Array.from({ length: Math.min(xs.length, ys.length) }).map((_, index) => fn(xs[index], ys[index], index));

zip(
    testFiles.map(fn => [fn, `./babel/${fn}`]),
    testFiles.map(fn => `./tsc/${fn}`),
    (babelPath, tscPath) => [babelPath[0], require(babelPath[1]), require(tscPath)]
).forEach(([fn, Babel, Tsc]) => {
    describe(fn, () => Object.keys(Babel)
        .map(suiteName => {
            const babelComponent = Babel[suiteName].component;
            const { component: tscComponent, dataSet } = Tsc[suiteName];
            return [suiteName, babelComponent, tscComponent, dataSet];
        })
        .forEach(
            (
                [
                    suiteName,
                    expectedComponent,
                    assertedComponent,
                    dataSet
                ]
            ) => dataSet.map(testProps => Object.assign({ expectedComponent, assertedComponent }, testProps)).forEach(compareInnerHTMLTest)
        )
    )
});
