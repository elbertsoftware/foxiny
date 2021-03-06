// @flow

// @babel/polyfill is needed to run bable translated code in production
// since we must replace 'babel-node' command in development with 'babel' command in production
// 'babel-node' command has @babel/polyfill included automatically
// while 'babel' command does not
// @babel/polyfill import must appear before any other code started
// /noConflict is needed to prevent circling import
import '@babel/polyfill/noConflict';

import server from './server';
import logger from './utils/logger';

const startServer = async port => {
  // node listens on IPv6 which is in this format: 2600:1700:dfa1:51a0:a088:143a:1edb:910f
  global.httpServer = await server.listen(port, () => {
    logger.info(`🚀  foxiny-gateway is up and running on port ${port}`);
  });
};

// dev server on port 4000, test server on port 5000, prod server depends on process.env.PORT
const port = process.env.PORT || 4000;
startServer(port);

/*
// sample how to stop server programatically
const stopServer = async () => {
  await global.httpServer.close();
  logger.info('🚁  foxiny-gateway has stopped');
};

// test stopServer
setTimeout(stopServer, 1000 * 2);
*/
