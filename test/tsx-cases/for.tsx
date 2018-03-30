import * as React from 'react';
import { For } from './types';

// this is unnecessary for compilation, but fools visuals studio code
// declare var i: number, chap: string;

export default {
    expected: ({ chaps }: { chaps: string[] }) => (
        <ol>
            <For each="chap" of={chaps} index="i">
                <li>{i}<strong>{chap}</strong></li>
            </For>
        </ol>
    ),
    actual: ({ chaps }: { chaps: string[] }) => (
        <ol>
            {chaps.map((chap, i) => <li>{i}<strong>{chap}</strong></li>)}
        </ol>
    ),
    dataSet: [
        [],
        ['steeve joobs', 'bil gaytes', 'lightlin naakov'],
        ['kek']
    ].map(chaps => ({ chaps }))
}
