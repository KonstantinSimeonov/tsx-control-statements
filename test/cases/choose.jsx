import * as React from 'react';

export const ChooseNumbers = ({ n }) => (
    <div>
        <Choose>
            <When condition={n === 1}>
                <p>n is 1</p>
            </When>
            <When condition={n === 2}>
                <h3>n is 2</h3>
            </When>
            <When condition={n === 10}>
                <b>n is 10</b>
            </When>
        </Choose>
    </div>
)

export const ChooseWithOtherwise = ({ name }) => (
    <div>
        <Choose>
            <When condition={name === 'gosho'}>
                gosho in da house
            </When>
            <Otherwise>
                gosho pie bira sig
            </Otherwise>
        </Choose>
    </div>
)
