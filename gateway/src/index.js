// @flow

// @babel/polyfill is needed to run bable translated code in production
// since we must replace 'babel-node' command in development with 'babel' command in production
// 'babel-node' command has @babel/polyfill included automatically
// while 'babel' command does not
// @babel/polyfill import must appear before any other code started
// /noConflict is needed to prevent circling import
import '@babel/polyfill/noConflict';

import graphQLServer from './graphql-server';

// dev server on port 4000, test server on port 5000, prod server depends on process.env.PORT
const port = process.env.PORT || 4000;
graphQLServer.start({ port }, () => {
  console.log(`foxiny-gateway is up and running on port ${port}`);
});
