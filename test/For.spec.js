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
});
