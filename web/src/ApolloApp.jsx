// @flow

import React from 'react';
import ApolloClient from 'apollo-boost';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import App from './components/App';
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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

export default ApolloApp;
