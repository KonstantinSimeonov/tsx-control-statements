import * as React from 'react';

export const ForChildrenExpressions = ({ words }) => (
    <article>
        <For each="w" index="i" of={words}>
            {3 + 4}
            <i>{i}. </i>
            <p>{w}</p>
        </For>
    </article>
)
