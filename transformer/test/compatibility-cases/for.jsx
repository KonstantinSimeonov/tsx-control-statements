import * as React from 'react';

// defo not overworking myself
const nextKey = () => Math.random() + String(Math.random() * 10000 * Math.random());

export const ForChildrenExpressions = {
    component: ({ words }) => (
        <article>
            <For each="w" index="i" of={words}>
                {3 + 4}
                <i key={nextKey()}>{i}. </i>
                <p key={nextKey()}>{w}</p>
            </For>
        </article>
    ),
    dataSet: [
        [[], 'same with []'],
        [['gosho', 'pesho', 'gg'], 'same with non-empty array']
    ].map(([words, message]) => ({ props: { words }, message }))
}

export const ForLongNames = {
    component: () => (
        <ul>
            <For each="number" index="index" of={[1, 2, 3, 42, 69, 666, 1024]}>
                <li key={nextKey()}>{number * index}</li>
            </For>
        </ul>
    ),
    dataSet: [{ props: {}, message: 'works with longer bindings names' }]
}

export const ForIndex = {
    component: () => (
        <p>
            <For each="number" index="index" of={[1, 2, 3, 42, 69, 666, 1024]}>
                {index}
            </For>
        </p>
    ),
    dataSet: [{ props: {}, message: 'index binding works' }]
}

export const ForKeyIndex = {
    component: () => (
        <ul>
            <For each="number" index="index" of={[1, 2, 3, 42, 69, 666, 1024]}>
                <li key={index}>{number * index}</li>
            </For>
        </ul>
    ),
    dataSet: [{ props: {}, message: 'can use index binding as key' }]
}

export const ForEmptyArray = {
    component: () => (
        <ul>
            <For each="number" index="index" of={[]}>
                <li key={index}>{number * index}</li>
            </For>
        </ul>
    ),
    dataSet: [{ props: {}, message: 'works with empty array' }]
}

export const ForNested = {
    component: ({ xs, ys }) => (
        <ol>
            <For each="x" of={xs} index="i">
                <li>
                    <ol>
                        <For each="y" of={ys} index="j">
                            <li>[{i}, {j}] = ({x}, {y})</li>
                        </For>
                    </ol>
                </li>
            </For>
        </ol>
    ),
    dataSet: [
        [[], []],
        [[], [1,2,3]],
        [[1,2], []],
        [[4,2,1], ['i', 'hate', 'nested', 'ctrl', 'flow']]
    ].map(([xs, ys]) => ({ props: { xs, ys }, message: `works for [${xs}] and [${ys}]` }))
}
