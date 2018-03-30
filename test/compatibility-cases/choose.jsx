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

export const ChooseMultipleChildren = ({ name }) => (
    <div>
        <Choose>
            <When condition={name === 'ivan'}>
                <h1>kek</h1>
                <p>ivan is here</p>
                {name + ' is haskell dev'}
            </When>
            <Otherwise>
                <h2>topkek</h2>
                <p>it is not ivan, but rather {name}</p>
                <b>neshto si neshto si</b>
            </Otherwise>
        </Choose>
    </div>
)

export const ChooseNested = ({ name }) => (
    <div>
        <Choose>
            <When condition={name.length < 3}>
                <Choose>
                    <When condition={name.length === 0}>
                        name cannot be empty
                    </When>
                    <Otherwise>
                        name too short
                    </Otherwise>
                </Choose>
            </When>
            <Otherwise>
                <Choose>
                    <When condition={name.length > 20}>
                        name too long
                    </When>
                    <Otherwise>
                        {name}
                    </Otherwise>
                </Choose>
                sdf
            </Otherwise>
        </Choose>
    </div>
)
