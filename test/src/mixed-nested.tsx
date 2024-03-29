import * as React from 'react';
import { Choose, When, Otherwise, For, If } from 'tsx-control-statements/components';

export default {
  actual: ({ songList }: { songList: string[] }) => (
    <div>
      <Choose>
        <When condition={songList.length === 0}>Song list is empty!</When>
        <Otherwise>
          <ul>
            <For each="songName" of={songList}>
              <If
                condition={
                  // @ts-ignore
                  songName
                }
              >
                <li
                  key={
                    // @ts-ignore
                    songName
                  }
                >
                  {
                    // @ts-ignore
                    songName
                  }
                </li>
              </If>
            </For>
          </ul>
        </Otherwise>
      </Choose>
    </div>
  ),
  expected: ({ songList }: { songList: string[] }) => (
    <div>
      {[
        songList.length === 0 ? `Song list is empty!` : null,
        <ul key="kekw">
          {songList
            .map(songName => (Boolean(songName) ? <li key={songName}>{songName}</li> : null))
            .filter(Boolean)}
        </ul>
      ].find(Boolean)}
    </div>
  ),
  dataSet: [
    [[], `When`],
    [[``, ``], `empty ul`],
    [
      [``, `Iron Maiden - The Monad (Horse & Penguin cover)`, `Britney - Toxic`, ``],
      `only non-empty song names as lis`
    ],
    [
      [
        `Iron Maiden - The Monad (Horse & Penguin cover)`,
        `Britney - Toxic`,
        `Gery-Nikol - I'm the Queen`
      ],
      `all the names as lis`
    ]
  ].map(([songList, message]) => ({ props: { songList }, message: `renders ${message}` }))
};
