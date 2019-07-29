// @flow

import logger from './logger';

// TODO: Replace require statement with import
const sms = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const from = process.env.CONFIRMATION_FROM_PHONE;

const sendConfirmationText = (name, to, code) => {
  const body = `Foxiny Admin said: ${name}, please use the code for confirmation form: ${code}`;

  // TODO: Research to use async/await to send sms
  sms.messages
    .create({
      from,
      to,
      body,
    })
    .then(message => {
      logger.debug(`Sent confirmation text to ${to} with receipt: ${message.sid}`);
    })
    .catch(error => {
      logger.error(`Failed to send confirmation text to ${to}: ${error}`);
    })
    .done();
};

const sendResetPasswordText = (name, to, password) => {
  // TBD
  logger.info(`TBD name: ${name}, email: ${to}, temporary password: ${password}`);
};

export { sendConfirmationText, sendResetPasswordText };
