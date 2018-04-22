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
}
