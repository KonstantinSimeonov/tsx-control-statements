import * as React from 'react';

import { If } from 'tsx-control-statements/components';

export default {
  actual: ({ songList }: { songList: string[] }) => (
    <p>
      <If condition={songList.includes(`Gery-Nikol - I'm the Queen`)}>good taste in music</If>
    </p>
  ),
  expected: ({ songList }: { songList: string[] }) => (
    <p>{songList.includes(`Gery-Nikol - I'm the Queen`) ? 'good taste in music' : null}</p>
  ),
  dataSet: [
    [['Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic'], 'renders text'],
    [
      [
        'Iron Maiden - The Monad (Horse & Penguin cover)',
        'Britney - Toxic',
        `Gery-Nikol - I'm the Queen`
      ],
      'does not render text'
    ]
  ].map(([songList, message]) => ({ props: { songList }, message }))
};

export const WithSelfClosingElementChild = {
  actual: ({ n }: { n: number }) => (
    <div>
      some text
      <If condition={n > 2}>
        <img src="https://cukii.me/img/Ripples-larry.svg" />
      </If>
    </div>
  ),
  expected: ({ n }: { n: number }) => (
    <div>
      some text
      {n > 2 ? <img src="https://cukii.me/img/Ripples-larry.svg" /> : null}
    </div>
  ),
  dataSet: [
    { props: { n: 1 }, message: 'works with self-closing children when condition is false' }
  ]
};

export const IfFragment = {
  expected: () => (
    <div>
      <>
        <p>1</p>
        <p>2</p>3
      </>
    </div>
  ),
  actual: () => (
    <div>
      <If condition={true}>
        <p>1</p>
        <p>2</p>3
      </If>
    </div>
  ),
  dataSet: [{ message: 'If with more than 1 child should transpile to a jsx fragment' }]
};

export const IfWithComments = {
  expected: () => (
    <div>
      <If condition={true}>
        {/*hahahaha*/
        /* haha */}
      </If>
    </div>
  ),
  actual: () => <div></div>,
  dataSet: [{ message: `Shouldn't crash from comments` }]
};
