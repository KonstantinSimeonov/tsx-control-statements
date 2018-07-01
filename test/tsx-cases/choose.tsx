import * as React from 'react';

export default {
    actual: ({ str }: { str: string }) => (
        <article>
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
        </article>
    ),
    expected: ({ str }: { str: string }) => (
        <article>
            {
                str === 'ivan' ? 'ivancho' : str === 'sarmi' ? <h1>yum!</h1> :  'im the queen da da da da'
            }
        </article>
    ),
    dataSet: [
        ['ivan', 'renders first When'],
        ['sarmi', 'renders second When'],
        ['banana', 'renders Otherwise']
    ].map(([str, message]) => ({ props: { str }, message }))
};

export const EmptyChoose = {
        actual: () => <div>123<Choose></Choose>123</div>,
        expected: () => <div>123123</div>,
        dataSet: [{ props: {}, message: 'empty choose is not rendered' }]
};

export const EmptyWhen = {
    actual: props => (
        <div>
            123
            <Choose>
                <When condition={Object.keys(props).length === 0}></When>
           </Choose>
            123
        </div>
    ),
    expected: () => <div>123123</div>,
    dataSet: [{ props: {}, message: 'empty when is not rendered' }]
};

export const NoConditionWhen = {
    actual: () => (
        <div>
           123
           <Choose>
                <When>goshogosho</When>
           </Choose>
           123
         </div>
    ),
    expected: () => <div>123123</div>,
    dataSet: [{ props: {}, message: 'when without condition is not rendered' }]
};

export const MisplacedOtherwise = {
    actual: () => (
        <div>
            123
            <Choose>
                <When condition={false}>1</When>
                <Otherwise>5</Otherwise>
                <When condition={true}>2</When>
                <Otherwise>3</Otherwise>
            </Choose>
        </div>
    ),
    expected: () => <div>1232</div>,
    dataSet: [{ props: {}, message: 'misplaced otherwise elements are skipped' }]
};

