import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import { Choose, For, If, Otherwise, When } from './typings/tsx-control-statements.d';

declare const pesho: number;
declare const i: number;
const randBool = () => Math.random() > 0.5;

class App extends React.Component {
  public render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <If condition={randBool()}>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Choose>
            <When condition={randBool()}>yey</When>
            <Otherwise>nop</Otherwise>
          </Choose>
        </If>
        <For each="pesho" of={[1, 2, 3]} index="i">
          <p>{pesho}{i}</p>
        </For>
      </div>
    );
  }
}

export default App;
