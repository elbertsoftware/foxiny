// @flow

//  ===================================================================================================================
// Jest's global Setup & Teardown are not processed thru Babel
// so we have to fall back to Node native syntax for import/export

//  ===================================================================================================================
// @babel/polyfill is needed to run bable translated code in production
// since we must replace 'babel-node' command in development with 'babel' command in production
// 'babel-node' command has @babel/polyfill included automatically
// while 'babel' command does not
// @babel/polyfill import must appear before any other code started
// /noConflict is needed to prevent circling import
require('@babel/polyfill/noConflict');

//  ===================================================================================================================
// use 'babel-register' to import 'graphql-server' implemneted with ES6 import/export
// into this file which uses Node native syntax
require('babel-register');

const graphQLServer = require('../../src/server').default;

// dev server on port 4000, test server on port 5000, prod server depends on process.env.PORT
module.exports = async () => {
  const port = 5000; // if port changed, make sure to correct the port number in the get-graphql-client.js

  // Use 'global' to pass variables between modules
  // global.httpServer will be used in stop-test-server.js to bring down the graphQLServer
  global.httpServer = await graphQLServer.listen({ port }, () => {
    console.log(`TEST foxiny-gateway is up and running on port ${port}`);
  });
};
