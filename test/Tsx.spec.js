const fs = require('fs');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

fs.readdirSync('./tsc')
    .filter(fileName => fileName.startsWith('tsx-'))
    .map(fileName => [fileName, Object.entries(require(`./tsc/${fileName}`))])
    .forEach(([fileName, testSuite]) => {
        // skip files that do not contain test suites
        if (typeof suite !== 'object') {
            return;
        }

        for (const [name, suite] of testSuite) {
            const suiteName = name.replace('default', fileName.replace('.js', '').replace('tsx-', ''));
            const {
                expected: expectedComponent,
                actual: assertedComponent,
                dataSet
            } = suite;

            describe(suiteName, () => {
                for (const testProps of dataSet) {
                    compareInnerHTMLTest({
                        ...testProps, expectedComponent, assertedComponent
                    });
                }
            });
        }
    });
