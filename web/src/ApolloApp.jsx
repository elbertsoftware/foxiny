// @flow

import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000',
});

const ApolloApp = () => (
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);

export default ApolloApp;
