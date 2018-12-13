// @flow

import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';

import UserList from './UserList';
import MyButton from './MyButton';

type State = {
  count: number,
};

type Props = {};

class App extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      count: 1,
    };

    this.countFunc = this.countFunc.bind(this);
  }

  countFunc: (count: number) => void;

  countFunc(count: number) {
    this.setState({
      count,
    });
  }

  render() {
    const { count } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit
            <code>src/App.js</code>
            and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>

        <div>
          <UserList />
        </div>

        <div>
          <h1>{count + 1}</h1>
          <MyButton name="Click Me" countFunc={this.countFunc} />
        </div>
      </div>
    );
  }
}

export default App;
