// @flow

import React, { Component } from 'react';
import { setAuthorizationToken } from '../utils/authentication';
import './App.css';
import withRoot from '../utils/withRoot';
import NavBar from './NavBar/NavBar';

class App extends Component<Props, State> {
  componentDidMount() {
    // TODO: Remove the following line after implementing login feature
    setAuthorizationToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanBzMWM1eGkwMDBwMDc4MThuMTdrbGVoIiwiaWF0IjoxNTQ1MDMzOTc2LCJleHAiOjE1NDU2Mzg3NzZ9.xmuynIpgPzmGwqdTOMf66qC-bqxGAEKD1oJwhUFJMFA',
    );
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
      </React.Fragment>
    );
  }
}

export default withRoot(App);
