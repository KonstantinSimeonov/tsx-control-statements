import * as React from 'react';
import { Choose, When, Otherwise } from './types';

export default {
    expected: ({ str }: { str: string }) => (
        <p>
            <Choose>
                <When condition={str === 'ivan'}>
                    ivancho
                    </When>
                <When condition={str === 'sarmi'}>
                    <h1>yum!</h1>
                </When>
                <Otherwise>
                    im the queen da da da da
                    </Otherwise>
            </Choose>
        </p>
    ),
    actual: ({ str }: { str: string }) => (
        <p>
            {[
                (str === 'ivan') && 'ivancho',
                (str === 'sarmi') && <h1>yum!</h1>,
                'im the queen da da da da'
            ].find(Boolean)}
        </p>
    ),
    dataSet: ['ivan', 'sarmi', 'banana'].map(str => ({ str }))
}

