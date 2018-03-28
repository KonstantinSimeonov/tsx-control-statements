import * as React from 'react';

// defo not overworking myself
const nextKey = () => Math.random() + String(Math.random() * 10000 * Math.random());

export const ForChildrenExpressions = ({ words }) => (
    <article>
        <For each="w" index="i" of={words}>
            {3 + 4}
            <i key={nextKey()}>{i}. </i>
            <p key={nextKey()}>{w}</p>
        </For>
    </article>
)

export const ForLongNames = () => (
    <ul>
        <For each="number" index="index" of={[1, 2, 3, 42, 69, 666, 1024]}>
            <li key={nextKey()}>{number * index}</li>
        </For>
    </ul>
)

export const ForIndex = () => (
    <p>
        <For each="number" index="index" of={[1, 2, 3, 42, 69, 666, 1024]}>
            {index}
        </For>
    </p>
)

export const ForKeyIndex = () => (
    <ul>
        <For each="number" index="index" of={[1, 2, 3, 42, 69, 666, 1024]}>
            <li key={index}>{number * index}</li>
        </For>
    </ul>
)

export const ForEmptyArray = () => (
    <ul>
        <For each="number" index="index" of={[]}>
            <li key={index}>{number * index}</li>
        </For>
    </ul>
)
