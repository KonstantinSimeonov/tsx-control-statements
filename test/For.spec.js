const { expect } = require('chai');
const Babel = require('./babel/for');
const Tsc = require('./tsc/for');
const React = require('react');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter });

describe('For', () => {
    it('renders without crashing', () => {
        enzyme.shallow(React.createElement(Tsc.ForChildrenExpressions, { words: ['haskell', 'sandwiches', 'wedgy'] }));
    });
});
