const Babel = require('./babel/with');
const Tsc = require('./tsc/with');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

describe('With', () => {
    [1, 2].forEach(n => compareInnerHTMLTest({
        message: 'works for one variable',
        expectedComponent: Babel.WithOneVariable,
        assertedComponent: Tsc.WithOneVariable,
        props: { n }
    }));

    compareInnerHTMLTest({
        message: 'works with many variables',
        expectedComponent: Babel.WithManyVariables,
        assertedComponent: Tsc.WithManyVariables,
        props: { x: 2, firstName: 'Maha', lastName: 'Tavani', people: ['ivan', 'penka', 'gery', 'nikol'] }
    });

    compareInnerHTMLTest({
        message: 'works with no variables (who does that anyway?)',
        expectedComponent: Babel.WithNoVariables,
        assertedComponent: Tsc.WithNoVariables,
        props: { thing: 'ctrl sttmnts thingie' }
    });

    compareInnerHTMLTest({
        message: 'works when some idiot has nested 4 Withs',
        expectedComponent: Babel.WithNested,
        assertedComponent: Tsc.WithNested,
        props: { xs: [1, 2, 3, 6, 10044] }
    });
});
