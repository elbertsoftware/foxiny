// @flow

import ApolloBoost from 'apollo-boost';

const getGraphQLClient = token => {
  return new ApolloBoost({
    uri: 'http://localhost:5000/graphql',
    request: operation => {
      // const token = await AsyncStorage.getItem('token');
      if (token) {
        operation.setContext({
          headers: {
            // Set JWT token to HTTP request header
            Authorization: `Bearer ${token}`,
            'accept-language': 'en-US',
            // acceptLanguage: 'en-US',
            // AcceptLanguage: 'en-US',
            // Accept_Language: 'en-US',
          },
        });
      }
    },
  });
};

// This client will send request to server throgh ngrok tunnel
const getGraphQLClientWithTunnel = (token, url) => {
  return new ApolloBoost({
    uri: url + ':/graphql',
    request: operation => {
      // const token = await AsyncStorage.getItem('token');
      if (token) {
        operation.setContext({
          headers: {
            // Set JWT token to HTTP request header
            Authorization: `Bearer ${token}`,
            'accept-language': 'en-US',
            // acceptLanguage: 'en-US',
            // AcceptLanguage: 'en-US',
            // Accept_Language: 'en-US',
          },
        });
      }
    },
  });
};

export default getGraphQLClient;

export { getGraphQLClientWithTunnel };
