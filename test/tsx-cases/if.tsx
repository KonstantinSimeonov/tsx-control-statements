import * as React from 'react';
import { If } from './types';

export default {
    actual: ({ songList }: { songList: string[] }) => (
        <p>
            <If condition={songList.includes(`Gery-Nikol - I'm the Queen`)}>
                good taste in music
            </If>
        </p>
    ),
    expected: ({ songList }: { songList: string[] }) => (
        <p>
            {
                songList.includes(`Gery-Nikol - I'm the Queen`) ? 'good taste in music' : null
            }
        </p>
    ),
    dataSet: [
        [['Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic'], 'renders text'],
        [['Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic', `Gery-Nikol - I'm the Queen`], 'does not render text']
    ].map(([songList, message]) => ({ props: { songList }, message }))
}
