import * as React from 'react';

import { Choose, When, Otherwise } from 'tsx-control-statements/components';

export default {
  actual: ({ str }: { str: string }) => (
    <article>
      <Choose>
        <When condition={str === 'ivan'}>ivancho</When>
        <When condition={str === 'sarmi'}>
          <h1>yum!</h1>
        </When>
        <Otherwise>im the queen da da da da</Otherwise>
      </Choose>
    </article>
  ),
  expected: ({ str }: { str: string }) => (
    <article>
      {str === 'ivan' ? 'ivancho' : str === 'sarmi' ? <h1>yum!</h1> : 'im the queen da da da da'}
    </article>
  ),
  dataSet: [
    ['ivan', 'renders first When'],
    ['sarmi', 'renders second When'],
    ['banana', 'renders Otherwise']
  ].map(([str, message]) => ({ props: { str }, message }))
};

export const MisplacedOtherwise = {
  actual: () => (
    <div>
      123
      <Choose>
        <When condition={false}>1</When>
        <Otherwise>5</Otherwise>
        <When condition={true}>2</When>
        <Otherwise>3</Otherwise>
      </Choose>
    </div>
  ),
  expected: () => <div>1232</div>,
  dataSet: [{ props: {}, message: 'misplaced otherwise elements are skipped' }]
};

export const ChooseFragment = {
  actual: () => (
    <div>
      123
      <Choose>
        <When condition={false}>1{'zdr'}</When>
        <When condition={true}>2{'anotha one'}</When>
        <Otherwise>
          <p>9</p>3
        </Otherwise>
      </Choose>
    </div>
  ),
  expected: () => <div>1232anotha one</div>,
  dataSet: [
    { props: {}, message: 'When/Otherwise with more than 1 child should transpile to fragments' }
  ]
};
