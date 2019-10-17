import * as React from 'react';

export const WithOneVariable = {
    component: ({ n }) => (
        <div>
            <With even={n % 2 === 0}>
                {even ? 'kek' : 'topkek'}
            </With>
        </div>
    ),
    dataSet: [
        [2, 'binding value is true'],
        [1, 'binding value is false']
    ].map(([n, message]) => ({ props: { n }, message }))
}

export const WithManyVariables = {
    component: ({ x, firstName, lastName, people }) => (
        <div>
            <With salary={x + 42} fullName={firstName + ' ' + lastName} employeesCount={people.length}>
                <b>{fullName}</b> is a promising young entepreneur from Kazichene. He currently has {employeesCount} employees and pays each of them {salary} per month.
            </With>
        </div>
    ),
    dataSet: [
        {
            props: { x: 3, firstName: 'remove', secondName: 'ceiling', people: ['penka', 'kaka ginka', 'lightlin naakov'] },
            message: 'works for multiple bindings'
        }
    ]
}

export const WithNoVariables = {
    component: ({ thing }) => (
        <div>
            <With>This {thing} is idiotic</With>
        </div>
    ),
    dataSet: [{ props: { thing: 'control statements thing' }, message: 'works with no variables' }]
}

export const WithNested = {
    component: ({ xs }) => (
        <div>
            <With fst={xs[0]}>
                {fst + 1}
                <With snd={xs[1]}>
                    {fst + snd}
                    <With last={xs.slice(-1).pop()}>
                        {last}
                    </With>
                    <With sum={xs.reduce((sum, n) => sum + n, 0)}>
                        <p>{fst}</p>
                        <p>{sum}</p>
                        {snd}
                    </With>
                </With>
            </With>
        </div>
    ),
    dataSet: [
        {
            props: { xs: [1, 2, 3, 4, 5, 6, 42, 69] },
            message: 'works when some idiot nests 3 Withs'
        }
    ]
}
