// @flow

import email from '@sendgrid/mail';

import logger from './logger';

email.setApiKey(process.env.SENDGRID_API_KEY);

const from = process.env.CONFIRMATION_FROM_EMAIL;

const sendConfirmationEmail = async (name, to, code) => {
  const text = `
    Dear ${name},
    
    Please use the following code to enter into the confirmation form:
    
    ${code}
    
    in order to activate your profile as soon as you receive this email.

    Thanks and regards,
    Foxiny Admin
  `;

  const html = `
    <p>Dear <strong>${name}</strong>,</p>
    <br>
    <p>Please use the following code to enter into the confirmation form:</p>
    <br>
    <p><strong>${code}</strong></p>
    <br>
    <p>in order to activate your profile as soon as you receive this email.</p>
    <br>
    <p>Thanks and regards,</p>
    <p><strong>Foxiny Admin</strong></p>
  `;

  const msg = {
    to,
    from,
    subject: '[foxiny] Account Confirmation',
    text,
    html,
  };

  try {
    await email.send(msg);
    logger.debug(`Sent confirmation email to ${to}`);
  } catch (error) {
    logger.error(`Failed to send confirmation email to ${to}: ${error}`);
  }
};

const sendResetPasswordEmail = (name, to, password) => {
  // TBD
  logger.info(`TBD name: ${name}, email: ${to}, temporary password: ${password}`);
};

export { sendConfirmationEmail, sendResetPasswordEmail };
