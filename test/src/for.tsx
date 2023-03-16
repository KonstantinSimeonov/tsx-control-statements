import * as React from 'react';
import { For, Choose, When, Otherwise, If } from 'tsx-control-statements/components';

// this is unnecessary for compilation, but fools visuals studio code
// declare var i: number, chap: string;

export const CanUseControlStatementsInBody = {
  actual: ({ words }: { words: string[] }) => (
    <div>
      <For
        of={words}
        body={(w, i) => (
          <Choose key={i}>
            <When condition={i % 2 === 0}>
              {w}
              <If condition={w.length <= 3}>stuff</If>
            </When>
            <Otherwise>{w + ` ` + w}</Otherwise>
          </Choose>
        )}
      />
    </div>
  ),
  expected: ({ words }: { words: string[] }) => (
    <div>
      {words.map((w, i) => (i % 2 === 0 ? w + (w.length <= 3 ? `stuff` : ``) : `${w} ${w}`))}
    </div>
  ),
  dataSet: [
    {
      props: { words: [`big`, `papa`, `top`, `kek`] },
      message: `Control statements in for loop body are transformed`
    }
  ]
};

export const NoOf = {
  expected: (): null => null,
  // @ts-ignore
  actual: () => <For each="test">haha</For>,
  dataSet: [{ props: {}, message: `renders null` }]
};

export const BadBodyProp = {
  expected: () => <p>123</p>,
  // @ts-ignore
  actual: () => (
    <p>
      <For each="i" of={[1, 2, 3]} body={String}>
        {i}
      </For>
    </p>
  ),
  dataSet: [{ props: {}, message: `uses for children when body is bad` }]
};

declare const chap: string;
declare const i: number;
export default {
  expected: ({ chaps }: { chaps: string[] }) => (
    <ol>
      <For each="chap" of={chaps} index="i">
        <li key={chap}>
          {i}
          <strong>{chap}</strong>
          <If condition={chap.length > 10}>a long one!</If>
        </li>
      </For>
    </ol>
  ),
  actual: ({ chaps }: { chaps: string[] }) => (
    <ol>
      {chaps.map((chap, i) => (
        <li key={chap}>
          {i}
          <strong>{chap}</strong>
          {chap.length > 10 ? `a long one!` : null}
        </li>
      ))}
    </ol>
  ),
  dataSet: [
    [[], `renders empty ol`],
    [[`steeve joobs`, `bil gaytes`, `lightlin naakov`], `renders a li for every chap`]
  ].map(([chaps, message]) => ({ props: { chaps }, message }))
};

export const EmptyFor = {
  expected: ({ peshovci }: { peshovci: any[] }) => (
    <ul>
      transformerfactory
      <For each="peshko" index="toshko" of={peshovci}></For>
    </ul>
  ),
  actual: () => <ul>transformerfactory</ul>,
  dataSet: [{ props: { peshovci: [1, 2, 3] }, message: `empty for renders nothing` }]
};

export const ForWithIterable = {
  expected: ({ xs }: { xs: Map<string, number> }) => (
    <ol>
      {Array.from(xs, (kvp, i) => (
        <span key={kvp[0]}>
          pair {i} with key {kvp[0]} and value {kvp[1]}
        </span>
      ))}
    </ol>
  ),
  actual: ({ xs }: { xs: Map<string, number> }) => (
    <ol>
      <For each="kvp" of={xs} index="i">
        {
          // @ts-ignore
          <span key={kvp[0]}>
            pair{` `}
            {
              // @ts-ignore
              i
            }{` `}
            with key{` `}
            {
              // @ts-ignore
              kvp[0]
            }{` `}
            and value{` `}
            {
              // @ts-ignore
              kvp[1]
            }
          </span>
        }
      </For>
    </ol>
  ),
  dataSet: [
    { props: { xs: new Map() }, message: `renders no pairs for empty iterator` },
    {
      props: {
        xs: new Map([
          [`a`, 2],
          [`c`, 15],
          [`d`, 69]
        ])
      },
      message: `uses the elements yielded by the iterator`
    }
  ]
};

export const LoopBody = {
  expected: ({ xs }: { xs: number[] }) => (
    <ol>
      {Array.from(xs, (x, i) => (
        <React.Fragment key={i}>
          {x}
          <p>{x * i}</p>
        </React.Fragment>
      ))}
    </ol>
  ),
  actual: ({ xs }: { xs: number[] }) => (
    <ol>
      <For
        of={xs}
        body={(x, i) => (
          <React.Fragment key={i}>
            {x}
            <p>{x * i}</p>
          </React.Fragment>
        )}
      />
    </ol>
  ),
  dataSet: [
    {
      props: { xs: [1, 5, 13] },
      message: `executes all iterations when provided with a function for body`
    },
    { props: { xs: [] }, message: `does not crash with empty input` },
    {
      props: {
        get xs() {
          // this is called more than once and should not be stateful
          return new Map([
            [1, `dsf`],
            [2, `zdr`],
            [5, `krp`],
            [8, `kyp`]
          ]).keys();
        }
      },
      message: `arrow body works with iterators`
    }
  ]
};
