const Babel = require('./babel/for');
const Tsc = require('./tsc/for');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

describe('For', () => {
    it('renders without crashing', () => {
        enzyme.shallow(React.createElement(Tsc.ForChildrenExpressions, { words: ['haskell', 'sandwiches', 'wedgy'] }));
    });

    compareInnerHTMLTest({
        message: 'renders expressions and elements',
        babelComponent: Babel.ForChildrenExpressions,
        tscComponent: Tsc.ForChildrenExpressions,
        props: { words: ['haskell', 'win api', 'wannacry', 'undefined', 'is', 'not', 'a', ''] }
    });

    compareInnerHTMLTest({
        message: 'long names for indentifiers work',
        babelComponent: Babel.ForLongNames,
        tscComponent: Tsc.ForLongNames
    });

    compareInnerHTMLTest({
        message: 'index works',
        babelComponent: Babel.ForIndex,
        tscComponent: Tsc.ForIndex
    });

    compareInnerHTMLTest({
        message: 'can use index as key',
        babelComponent: Babel.ForKeyIndex,
        tscComponent: Tsc.ForKeyIndex
    });

    compareInnerHTMLTest({
        message: 'works for empty array',
        babelComponent: Babel.ForEmptyArray,
        tscComponent: Tsc.ForEmptyArray
    });
});
