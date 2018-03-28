export const ForChildrenExpressions = ({ words }) => (
    <article>
        <For each="w" index="i" of={words}>
            <p>{i}. {w}</p>
        </For>
    </article>
)
