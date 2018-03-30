const Babel = require('./babel/choose');
const Tsc = require('./tsc/choose');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

describe('Choose', () => {
    it('renders without crashing', () => {
        enzyme.shallow(React.createElement(
            Tsc.ChooseNumbers,
            { n: 1 }
        ))
    });

    [
        ...[2, 1, 10, 42].map(n => ({
            message: 'when works',
            expectedComponent: Babel.ChooseNumbers,
            assertedComponent: Tsc.ChooseNumbers,
            props: { n }
        })),
        ...['pesho', 'gosho'].map(name => ({
            message: 'when + otherwise works',
            expectedComponent: Babel.ChooseWithOtherwise,
            assertedComponent: Tsc.ChooseWithOtherwise,
            props: { name: 'gosho' }
            
        })),
        ...['ivan', 'haralampi'].map(name => ({
            message: 'when + otherwise works with multiple children',
            expectedComponent: Babel.ChooseWithOtherwise,
            assertedComponent: Tsc.ChooseWithOtherwise,
            props: { name }
        }))
    ].forEach(compareInnerHTMLTest);
});
