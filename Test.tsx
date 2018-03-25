import * as React from 'react';

class Test extends React.Component {
    render() {
        const a = Math.random() > 0.5;
        return (
            <div>
                <If condition={this.props.renderLinks}>
                    <a href="http://github.com">github</a>
                    <a href="http://hooktube.com">hooktube</a>
                    {a && (3 > 4)}
                </If>
                <div>gosho</div>
                <For const="item" of={[1, 2, 3]}>
                    {item}
                </For>
                {
                    a && [1,2,3].map(i => <p>{i}</p>)
                }

            </div>
        )
    }
}

// class Result extends React.Component {
//     render() {
//         return (
//             <div>
//                 {this.props.renderLinks && []
//                     <a href="http://github.com">github</a>
//                     <a href="http://hooktube.com">hooktube</a>
//                 </If>
//                 <For name="item" of={[1, 2, 3]}>
//                     {item}
//                 </For>
//             </div>
//         )
//     }
// }