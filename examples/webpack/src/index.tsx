import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { For, If, Choose, When, Otherwise, With } from 'tsx-control-statements/components';

// Bindings in <For /> body cause compile time errors without those declarations.
declare const i: number;
declare const thingy: string;
declare const emoji: string;

export default class Example extends React.Component<{}, { things: string[] }> {
	constructor(props) {
		super(props);

		this.state = { things: ['this', 'is', 'demo'] };
	}

	_onChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		things: event.target.value.split(' ').filter(Boolean)
	})

	render() {
        const { things } = this.state;
		return (
			<div>
				<input type="text" onChange={this._onChange} />
				<Choose>
					<When condition={things.length > 0}>
						<h1>{things.length} thingies:</h1>
						<For each="thingy" index="i" of={things}>
							<p key={i}>{i}. {thingy}</p>
							<If condition={i >= 6}>
								<p key="karamba">Karambaaaa</p>
							</If>
						</For>
					</When>
					<Otherwise>
						<With emoji=":(">
							no thingies {emoji}
						</With>
					</Otherwise>
				</Choose>
			</div>
		)
	}
}

ReactDOM.render(<Example />, document.getElementById('app-container'));
