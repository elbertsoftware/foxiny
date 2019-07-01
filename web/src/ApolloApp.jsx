// @flow

import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ToastContainer } from 'react-toastify';
import App from './components/App/App';
import { getAuthorizationToken } from './utils/authentication';

const uploadLink = createUploadLink({ uri: process.env.REACT_APP_GATEWAY_URL });

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GATEWAY_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getAuthorizationToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Accept-Language': 'vi',
    },
  };
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  link: ApolloLink.from([authLink, uploadLink, httpLink]),
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
