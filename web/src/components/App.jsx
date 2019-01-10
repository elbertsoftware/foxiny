// @flow

import React, { Component } from 'react';
import { loadReCaptcha } from 'react-recaptcha-google';
import { Route, Switch } from 'react-router-dom';
import { setAuthorizationToken } from '../utils/authentication';
import './App.css';
import withRoot from '../utils/withRoot';
import NavBar from './NavBar/NavBar';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

class App extends Component<Props, State> {
  componentDidMount() {
    // TODO: Remove the following line after implementing login feature
    setAuthorizationToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanBzMWM1eGkwMDBwMDc4MThuMTdrbGVoIiwiaWF0IjoxNTQ1MDMzOTc2LCJleHAiOjE1NDU2Mzg3NzZ9.xmuynIpgPzmGwqdTOMf66qC-bqxGAEKD1oJwhUFJMFA',
    );
    loadReCaptcha();
  }

  render() {
    return (
      <React.Fragment>
        <Route
          path="/(.+)"
          render={() => (
            <div>
              <Switch>
                <Route exact path="/" component={NavBar} />
              </Switch>
              <Switch>
                <Route path="/signin" component={SignIn} />
              </Switch>
              <Switch>
                <Route path="/signup" component={SignUp} />
              </Switch>
            </div>
          )}
        />
      </React.Fragment>
    );
  }
}

export default withRoot(App);
