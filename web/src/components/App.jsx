// @flow

import React, { Component } from 'react';
import { loadReCaptcha } from 'react-recaptcha-google';
import { Route, Switch, withRouter } from 'react-router';
import compose from 'recompose/compose';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import withRoot from '../utils/withRoot';
import NavBar from './NavBar/NavBar';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import ConfirmPage from './Form/ConfirmPage';

class App extends Component<Props, State> {
  componentDidMount() {
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
