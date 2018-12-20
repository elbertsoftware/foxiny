// @flow

import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './components/App';
import 'gestalt/dist/gestalt.css';
import { getAuthorizationToken } from './utils/authentication';

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GATEWAY_URL,
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: getAuthorizationToken(),
      },
    }));
  },
});

const ApolloApp = () => (
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);

export default ApolloApp;
