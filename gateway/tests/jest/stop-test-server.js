// @flow

//  ===================================================================================================================
// Jest's global Setup & Teardown are not processed thru Babel
// so we have to fall back to Node native syntax for import/export

module.exports = async () => {
  // global.httpServer was assigned in 'start-test-server.js'
  await global.httpServer.close();
};
