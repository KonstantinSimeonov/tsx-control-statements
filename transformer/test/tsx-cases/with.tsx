import * as React from 'react';

import { With } from 'tsx-control-statements/components';

// this is unnecessary for compilation, but fools visuals studio code
// declare var gosho: number, pesho: number, tosho: number;

export default {
    actual: () => (
        <p>
            <With gosho={3} pesho={5} tosho={6}>
                {gosho + pesho + tosho}
            </With>
        </p>
    ),
    expected: () => (
        <p>
            {14}
        </p>
    ),
    dataSet: [{ props: {}, message: 'bindings defined in With are available in the children expressions' }]
}
