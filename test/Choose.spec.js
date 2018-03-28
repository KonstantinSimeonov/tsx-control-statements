const Babel = require('./babel/choose');
const Tsc = require('./tsc/choose');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const compareInnerHTMLTest = require('./helpers/compare-inner-html-test');

enzyme.configure({ adapter: new Adapter });

describe('Choose', () => {
    it('renders without crashing', () => {
        console.log(Tsc, 'kekekekekek')
        enzyme.shallow(React.createElement(
            Tsc.ChooseNumbers,
            { n: 1 }
        ))
    });

    [
        {
            message: 'when works',
            babelComponent: Babel.ChooseNumbers,
            tscComponent: Tsc.ChooseNumbers,
            props: { n: 2 }
        },
        {
            message: 'when + otherwise works',
            babelComponent: Babel.ChooseWithOtherwise,
            tscComponent: Tsc.ChooseWithOtherwise,
            props: { name: 'pesho' }
            
        }
    ].forEach(compareInnerHTMLTest);
});
