// @flow

import React, { Component } from 'react';
import NavBar from './nav/NavBar/NavBar';
import Banner from './Banner/Banner';
import 'gestalt/dist/gestalt.css';
import { setAuthorizationToken } from '../utils/authentication';
import './App.css';

class App extends Component<Props, State> {
  componentDidMount() {
    // TODO: Remove the following line after implementing login feature
    setAuthorizationToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanBzMWM1eGkwMDBwMDc4MThuMTdrbGVoIiwiaWF0IjoxNTQ1MDMzOTc2LCJleHAiOjE1NDU2Mzg3NzZ9.xmuynIpgPzmGwqdTOMf66qC-bqxGAEKD1oJwhUFJMFA',
    );
  }

  render() {
    return (
      <div>
        <NavBar />
        <Banner />
      </div>
    );
  }
}

export default App;
