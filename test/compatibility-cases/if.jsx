import * as React from 'react';

const ListFive = ({ messages }) => (
	<ul>
		{messages.slice(0, 5).map((m, i) => <li key={i}>{m}</li>)}
	</ul>
);

const selfClosingElements = [
	<img src="https://cukii.me/img/Ripples-larry.svg" />,
	<ListFive messages={'123456'.split('')} />,
	<input type="text" placeholder="fun" />
];

export const IfChildElements = {
    component: ({ condition }) => (
        <div>
            <h1>useful links</h1>
            <If condition={condition}>
                <a href="https://wiki.gentoo.org/wiki/Handbook:Main_Page">install gentoo</a>
                <a href="https://github.com">github</a>
            </If>
        </div>
    ),
    dataSet: [
        { props: { condition: true }, message: 'renders links' },
        { props: { condition: false }, message: 'does not render links' },
    ]
}

export const IfSelfClosingChildElements = {
	component: ({ condition }) => (
		<p>
			<If condition={condition}>
				{selfClosingElements}
			</If>
		</p>
	),
	dataSet: [
		{ props: { condition: true }, message: 'renders self-closing children' },
		{ props: { condition: false }, message: 'does not render self-closing' },
	]
}

export const IfChildExpressions = {
    component: ({ a, b, condition }) => (
        <div>
            <h1>maths</h1>
            <If condition={condition}>
                3 + 4 = {3 + 4}
                {a} + {b} = {a + b}
            </If>
        </div>
    ),
    dataSet: [
        [7, 8, false, 'does not render child expressions'],
        [7, 8, true, 'renders child expressions']
    ].map(([a, b, condition, message]) => ({ props: { a, b, condition }, message }))
}

export const IfChildExpressionsAndElements = {
    component: ({ a, b, condition }) => (
        <div>
            <h1>maths</h1>
            <If condition={condition}>
                3 + 4 = {3 + 4}
                <a href="https://wiki.gentoo.org/wiki/Handbook:Main_Page">install gentoo</a>
                <a href="https://github.com">github</a>
		{a} + {b} = {a + b}
		{selfClosingElements}
            </If>
        </div>
    ),
    dataSet: JSON.parse(JSON.stringify(IfChildExpressions.dataSet))
}

export const IfConditionIsExpressions = {
    component: ({ name1, name2 }) => (
        <article>
            <If condition={name1.length !== 0}>
                <h1>First: {name1}</h1>
            </If>
            <If condition={name1 !== name2 && name2.length !== 0}>
                <h2>Second: {name2}</h2>
            </If>
        </article>
    ),
    dataSet: [
        ['gosho', 'vancho', 'boolean expressions as conditions work'],
        ['', 'vancho', 'boolean expressions as conditions work']
    ].map(([name1, name2, message]) => ({ props: { name1, name2 }, message }))
}

export const NestedIfs = {
    component: ({ a, b }) => (
        <div>
            <If condition={a % 2 === 1}>
                <h1>a is add</h1>
                <If condition={b % 2 === 1}>
                    b is odd
                </If>
                <If condition={b % 2 === 0}>
                    b is even
                </If>
            </If>
        </div>
    ),
    dataSet: [
        [0, 1, 'does not render nested content'],
        [3, 1, 'renders nested content correctly'],
        [3, 2, 'renders nested content correctly']
    ].map(([a, b, message]) => ({ props: { a, b }, message }))
}

export const EmptyIfs = {
    component: ({ a, b }) => (
        <p>
            <If condition={b % 2 === 1}>
            </If>
            <If condition={b % 2 === 0}>
            </If>
        </p>
    ),
    dataSet: [{ props: {}, message: 'renders nothing' }]
}

export const EmptyNestedIfs = {
    component: ({ a, b }) => (
        <p>
            <If condition={a % 2 === 1}>
                <If condition={b % 2 === 1}>
                </If>
                <If condition={b % 2 === 0}>
                </If>
            </If>
        </p>
    ),
    dataSet: [
        [0, 1],
        [0, 2],
        [1, 2],
        [1, 3]
    ].map(([a, b]) => ({ props: { a, b }, message: 'never do this. please' }))
}

export const IfMultipleProps = {
    component: ({ condition }) => (
        <p>
            <If prop1={3} prop5={5} condition={condition} kekLevel="topkek">
                <b>kljsdfjklsdfjklsdfjkl</b>
            </If>
        </p>
    ),
    dataSet: [
        { props: { condition: true }, message: 'renders content' },
        { props: { condition: false }, message: 'does not render content' }
    ]
}
