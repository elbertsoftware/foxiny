import axios from 'axios';
import logger from './logger';

// instance of axios
const instance = axios.create({
  baseURL: 'http://rest.esms.vn/MainService.svc/json',
});

/**
 * Send confirmation code by esms (in VN)
 * @param {String} name User name
 * @param {String} to User phone number
 * @param {String} code Confirmation code
 */
const sendConfirmationEsms = (name, to, code) =>
  new Promise((resolve, reject) => {
    const data = {
      Phone: to,
      Content: `Your verification code for account ${name} is ${code}`,
      ApiKey: process.env.VN_ESMS_API_KEY,
      SecretKey: process.env.VN_ESMS_SECRET_KEY,
      SmsType: Number(process.env.VN_ESMS_SMS_TYPE),
      Brandname: process.env.VN_ESMS_BRAND_NAME,
    };

    instance
      .get('/SendMultipleMessage_V4_get', {
        params: data,
      })
      .then(response => {
        logger.debug(`🔷  eSMS requestId: ${response.data.SMSID}`);
      })
      .catch(error => {
        logger.debug(`🔴❌  eSMS error: ${error}`);
      });
  });

export { sendConfirmationEsms };
