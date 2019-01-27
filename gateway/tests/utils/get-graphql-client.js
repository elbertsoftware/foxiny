// @flow

import ApolloBoost from 'apollo-boost';

const getGraphQLClient = token => {
  return new ApolloBoost({
    uri: 'http://localhost:5000/graphql',
    request: operation => {
      if (token) {
        operation.setContext({
          headers: {
            // Set JWT token to HTTP request header
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
  });
};

export default getGraphQLClient;
