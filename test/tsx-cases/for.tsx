import * as React from 'react';

// this is unnecessary for compilation, but fools visuals studio code
// declare var i: number, chap: string;

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
    expected: ({ peshovci }: { peshovci: any[] }) => (
            <ul>
                transformerfactory
                <For each="peshko" index="toshko" of={peshovci}>
                </For>
            </ul>
    ),
    actual: () => (
            <ul>
                transformerfactory
            </ul>
    ),
    dataSet: [
        { props: { peshovci: [1, 2, 3] }, message: 'empty for renders nothing' }
    ]
};

export const NoArrayFor = {
    expected: ({ peshovci }: { peshovci: any[] }) => (
            <ul>
                transformerfactory
                <For each="peshko" index="toshko">
                        <li key={peshko}>{peshko}</li>
                </For>
            </ul>
    ),
    actual: () => (
            <ul>
                transformerfactory
            </ul>
    ),
    dataSet: [
        { props: { peshovci: [1, 2, 3] }, message: 'for without array renders nothing' }
    ]
};

