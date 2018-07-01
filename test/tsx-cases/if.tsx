import * as React from 'react';

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

export const EmptyIf = {
        actual: () => <p>123<If condition={true}></If>neshto si</p>,
        expected: () =>  <p>123neshto si</p>,
        dataSet: [{ props: {}, message: 'empty if does not render anything' }]
};

export const NoConditionIf = {
        actual: () => <p>123<If>tuka ima tuka nema</If>neshto si</p>,
        expected: () =>  <p>123neshto si</p>,
        dataSet: [{ props: {}, message: 'if without condition does not render anything' }]
};

