import { expect } from 'chai';
import * as React from 'react';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

// this registers ts-node with tsx-control-statements transformer
import './ts-node-register';
import Example from './Example';

Enzyme.configure({ adapter: new Adapter() });

describe('test example', () => {
    it('can run a test with tsx-control-statements', () => {
        Enzyme.shallow(<Example />)
    });
});
