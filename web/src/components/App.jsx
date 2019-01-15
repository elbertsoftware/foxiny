// @flow

import React, { Component } from 'react';
import { loadReCaptcha } from 'react-recaptcha-google';
import { Route, Switch, withRouter } from 'react-router';
import compose from 'recompose/compose';
import { setAuthorizationToken } from '../utils/authentication';
import './App.css';
import withRoot from '../utils/withRoot';
import NavBar from './NavBar/NavBar';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import ConfirmPage from './form/ConfirmPage';

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
        <Switch>
          <Route exact path="/" component={NavBar} />
        </Switch>
        <Route
          path="/(.+)"
          render={() => (
            <React.Fragment>
              <Switch>
                <Route path="/signin" component={SignIn} />
              </Switch>
              <Switch>
                <Route path="/signup" component={SignUp} />
              </Switch>
              <Switch>
                <Route path="/confirm/:id" component={ConfirmPage} />
              </Switch>
            </React.Fragment>
          )}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  withRoot,
)(App);
