const Babel = require('./babel/for');
const Tsc = require('./tsc/for');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');
const For = require('./tsc/tsx-for').default;

enzyme.configure({ adapter: new Adapter });

describe('For', () => {
    it('renders without crashing', () => {
        enzyme.shallow(React.createElement(Tsc.ForChildrenExpressions, { words: ['haskell', 'sandwiches', 'wedgy'] }));
    });

    compareInnerHTMLTest({
        message: 'renders expressions and elements',
        expectedComponent: Babel.ForChildrenExpressions,
        assertedComponent: Tsc.ForChildrenExpressions,
        props: { words: ['haskell', 'win api', 'wannacry', 'undefined', 'is', 'not', 'a', ''] }
    });

    compareInnerHTMLTest({
        message: 'long names for indentifiers work',
        expectedComponent: Babel.ForLongNames,
        assertedComponent: Tsc.ForLongNames
    });

    compareInnerHTMLTest({
        message: 'index works',
        expectedComponent: Babel.ForIndex,
        assertedComponent: Tsc.ForIndex
    });

    compareInnerHTMLTest({
        message: 'can use index as key',
        expectedComponent: Babel.ForKeyIndex,
        assertedComponent: Tsc.ForKeyIndex
    });

    compareInnerHTMLTest({
        message: 'works for empty array',
        expectedComponent: Babel.ForEmptyArray,
        assertedComponent: Tsc.ForEmptyArray
    });

    compareInnerHTMLTest({
        message: 'works for nested loops',
        expectedComponent: Babel.ForNested,
        assertedComponent: Tsc.ForNested,
        props: {
            xs: [1, 2, 3],
            ys: ['i', 'hate', 'nested', 'ctrl', 'flow']
        }
    });

    For.dataSet.forEach(props => compareInnerHTMLTest({
        message: 'works when compiled from typescript',
        assertedComponent: For.actual,
        expectedComponent: For.expected,
        props
    }));
});
