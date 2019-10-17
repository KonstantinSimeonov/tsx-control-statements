import * as React from 'react';

import { For } from 'tsx-control-statements/components';

// this is unnecessary for compilation, but fools visuals studio code
// declare var i: number, chap: string;

export const NoOf = {
    expected: () => null,
    actual: () => <For each="test">haha</For>,
    dataSet: [
        { props: {}, message: 'renders null' }
    ]
}

export const BadBodyProp = {
    expected: () => <p>123</p>,
    actual: () => <p><For each="i" of={[1, 2, 3]} body={String}>{i}</For></p>,
    dataSet: [
        { props: {}, message: 'uses for children when body is bad' }
    ]
}

export default {
    expected: ({ chaps }: { chaps: string[] }) => (
        <ol>
            <For each="chap" of={chaps} index="i">
                <li key={chap}>{i}<strong>{chap}</strong></li>
            </For>
        </ol>
    ),
    actual: ({ chaps }: { chaps: string[] }) => (
        <ol>
            {chaps.map((chap, i) => <li key={chap}>{i}<strong>{chap}</strong></li>)}
        </ol>
    ),
    dataSet: [
        [[], 'renders empty ol'],
        [['steeve joobs', 'bil gaytes', 'lightlin naakov'], 'renders a li for every chap'],
    ].map(([chaps, message]) => ({ props: { chaps }, message }))
};

export const EmptyFor = {
    expected: ({ peshovci }: { peshovci: any[] }) => <ul>
        transformerfactory
        <For each="peshko" index="toshko" of={peshovci}>
        </For>
    </ul>,
    actual: () => <ul>transformerfactory</ul>,
    dataSet: [
        { props: { peshovci: [1, 2, 3] }, message: 'empty for renders nothing' }
    ]
};

export const ForWithIterable = {
    expected: ({ xs }: { xs: Map<string, number> }) => (
        <ol>
            {Array.from(
                xs,
                (kvp, i) => <span key={kvp[0]}>pair {i} with key {kvp[0]} and value {kvp[1]}</span>
            )}
        </ol>
    ),
    actual: ({ xs }: { xs: Map<string, number> }) => (
        <ol>
            <For each="kvp" of={xs} index="i">
                <span key={kvp[0]}>pair {i} with key {kvp[0]} and value {kvp[1]}</span>
            </For>
        </ol>
    ),
    dataSet: [
        { props: { xs: new Map }, message: 'renders no pairs for empty iterator' },
        {
            props: { xs: new Map([['a', 2], ['c', 15], ['d', 69]]) },
            message: 'uses the elements yielded by the iterator'
        }
    ]
};

export const LoopBody = {
    expected: ({ xs }: { xs: number[]; }) => <ol>
        {Array.from(xs, (x, i) => <>{x}<p>{x * i}</p></>)}
    </ol>,
    actual: ({ xs }: { xs: number[]; }) => <ol>
        <For of={xs} body={(x, i) => <>{x}<p>{x * i}</p></>} />
    </ol>,
    dataSet: [
        { props: { xs: [1, 5, 13] }, message: 'executes all iterations when provided with a function for body' },
        { props: { xs: [] }, message: 'does not crash with empty input' },
        {
            props: {
                get xs() {
                    // this is called more than once and should not be stateful
                    return new Map([[1, 'dsf'], [2, 'zdr'], [5, 'krp'], [8, 'kyp']]).keys();
                }
            },
            message: 'arrow body works with iterators'
        }
    ]
};
