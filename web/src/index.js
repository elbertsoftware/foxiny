// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient, { gql } from 'apollo-boost';

import './index.css';

import ApolloApp from './ApolloApp';
import * as serviceWorker from './serviceWorker';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000',
  request(operation) {
    operation.setContext({
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanA5OGgwMjYwMDBiMDc5NG9oMDQ3bng2IiwiaWF0IjoxNTQzODk3MTAzLCJleHAiOjE1NDQ1MDE5MDN9.L0UZOilliwdeM-oGXoarBAzopnV7rN5WaUn-W25rflA',
      },
    });
  },
});

apolloClient
  .query({
    query: gql`
      query {
        users {
          name
          email
          password

          createdAt
          updatedAt
        }
      }
    `,
  })
  .then(result => console.log(`>>>>>>> sample result: ${JSON.stringify(result)}`));

ReactDOM.render(<ApolloApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
