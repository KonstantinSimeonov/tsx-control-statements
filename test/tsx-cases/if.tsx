import * as React from 'react';
import { If } from './types';

export default {
    expected: ({ songList }: { songList: string[] }) => (
        <ol>
            <If condition={songList.includes(`Gery-Nikol - I'm the Queen`)}>
                good taste in music
            </If>
        </ol>
    ),
    actual: ({ songList }: { songList: string[] }) => (
        <ol>
            {
                songList.includes(`Gery-Nikol - I'm the Queen`) ? 'good taste in music' : null
            }
        </ol>
    ),
    dataSet: [
        ['Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic'],
        ['Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic', `Gery-Nikol - I'm the Queen`]
    ].map(songList => ({ songList }))
}
