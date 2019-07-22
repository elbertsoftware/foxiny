// @flow

//  ===================================================================================================================
// Jest's global Setup & Teardown are not processed thru Babel
// so we have to fall back to Node native syntax for import/export

// const ngrok = require('ngrok');

module.exports = async () => {
  // global.httpServer was assigned in 'start-test-server.js'
  await global.httpServer.close();
  console.log(`TEST foxiny-gateway is down`);

  // await ngrok.disconnect();
  // await ngrok.kill();
  // console.log('TEST ngrok tunnel is down');
};
