// @flow

import React from 'react';
import ApolloClient from 'apollo-boost';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ToastContainer } from 'react-toastify';
import App from './components/App';
import { getAuthorizationToken } from './utils/authentication';
import { resolvers, typeDefs } from './graphql/resolvers';

const cache = new InMemoryCache();

const defaultState = {
  currentUser: {
    __typename: 'CurrentUser',
    name: '',
    email: '',
    phone: '',
    token: null,
  },
};

const apolloClient = new ApolloClient({
  cache,
  clientState: {
    defaults: defaultState,
    resolvers,
    typeDefs,
  },
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
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnVisibilityChange
      draggable
      pauseOnHover
    />
  </ApolloProvider>
);

export default ApolloApp;
