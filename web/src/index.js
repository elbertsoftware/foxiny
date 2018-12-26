/* eslint-disable react/jsx-filename-extension */
// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import env from 'dotenv';

import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ApolloApp from './ApolloApp';
import * as serviceWorker from './serviceWorker';

env.config();

// variables which are defined in the .env file and started with REACT_APP_ prefix should be displayed here
// console.log(process.env);
const Root = () => (
  <Router>
    <Switch>
      <Route component={ApolloApp} exact path="/" />
    </Switch>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
