import * as React from 'react';

export const WithOneVariable = ({ n }) => (
    <div>
        <With even={n % 2 === 0}>
            {even ? 'kek' : 'topkek'}
        </With>
    </div>
)

export const WithManyVariables = ({ x, firstName, lastName, people }) => (
    <div>
        <With salary={x + 42} fullName={firstName + ' ' + lastName} employeesCount={people.length}>
            <b>{fullName}</b> is a promising young entepreneur from Kazichene. He currently has {employeesCount} employees and pays each of them {salary} per month.
        </With>
    </div>
)

export const WithNoVariables = ({ thing }) => (
    <div>
        <With>This {thing} is idiotic</With>
    </div>
)

export const WithNested = ({ xs }) => (
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
)
