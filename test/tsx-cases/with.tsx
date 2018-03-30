import * as React from 'react';
import { With } from './types';

// this is unnecessary for compilation, but fools visuals studio code
// declare var gosho: number, pesho: number, tosho: number;

export default {
    expected: () => (
        <p>
            <With gosho={3} pesho={5} tosho={6}>
                {gosho + pesho + tosho}
            </With>
        </p>
    ),
    actual: ({ songList }: { songList: string[] }) => (
        <p>
            {14}
        </p>
    ),
    dataSet: [{}]
}
