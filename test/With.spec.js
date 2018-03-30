const Babel = require('./babel/with');
const Tsc = require('./tsc/with');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

describe.only('With', () => {
    [1, 2].forEach(n => compareInnerHTMLTest({
        message: 'works for one variable',
        babelComponent: Babel.WithOneVariable,
        tscComponent: Tsc.WithOneVariable,
        props: { n }
    }));

    compareInnerHTMLTest({
        message: 'works with many variables',
        babelComponent: Babel.WithManyVariables,
        tscComponent: Tsc.WithManyVariables,
        props: { x: 2, firstName: 'Maha', lastName: 'Tavani', people: ['ivan', 'penka', 'gery', 'nikol'] }
    });

    compareInnerHTMLTest({
        message: 'works with no variables (who does that anyway?)',
        babelComponent: Babel.WithNoVariables,
        tscComponent: Tsc.WithNoVariables,
        props: { thing: 'ctrl sttmnts thingie' }
    })
});
