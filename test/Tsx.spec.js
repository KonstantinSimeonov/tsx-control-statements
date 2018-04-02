const fs = require('fs');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

fs.readdirSync('./tsc')
    .filter(fn => fn.startsWith('tsx-'))
    .map(fn => [fn, Object.entries(require(`./tsc/${fn}`))])
    .forEach(
        ([fn, testSuite]) => testSuite.map(([name, suite]) => {
            const suiteName = name.replace('default', fn.replace('.js', '').replace('tsx-', ''));
            describe(suiteName, () => {
                const { expected, actual, dataSet } = suite;
                console.log(expected, actual)
                dataSet.map(propsAndMessage => Object.assign(propsAndMessage, {
                        expectedComponent: expected,
                        assertedComponent: actual
                    })
                )
                    .forEach(compareInnerHTMLTest);
            });
        })
    );
