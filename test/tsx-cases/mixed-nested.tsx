import * as React from 'react';

export default {
    actual: ({ songList }: { songList: string[] }) => (
        <div>
            <Choose>
                <When condition={songList.length === 0}>
                    Song list is empty!
                </When>
                <Otherwise>
                    <ul>
                        <For each="songName" of={songList}>
                            <If condition={Boolean(songName)}>
                                <li key={songName}>{songName}</li>
                            </If>
                        </For>
                    </ul>
                </Otherwise>
            </Choose>
        </div>
    ),
    expected: ({ songList }: { songList: string[] }) => (
        <div>
            {
                [
                    (songList.length === 0) ? 'Song list is empty!' : null,
                    <ul>
                        {
                            songList.map(songName => Boolean(songName) ? <li key={songName}>{songName}</li> : null).filter(Boolean)
                        }
                    </ul>
                ].find(Boolean)
            }
        </div>
    ),
    dataSet: [
        [[], 'When'],
        [['', ''], 'empty ul'],
        [['', 'Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic', ''], `only non-empty song names as li's`],
        [['Iron Maiden - The Monad (Horse & Penguin cover)', 'Britney - Toxic', `Gery-Nikol - I'm the Queen`], `all the names as li's`]
    ].map(([songList, message]) => ({ props: { songList }, message: `renders ${message}` }))
}
