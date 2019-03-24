import axios from 'axios';
import logger from './logger';

// instance of axios
const instance = axios.create({
  baseURL: 'http://rest.esms.vn/MainService.svc/json',
});

const sendConfirmationEsms = (name, to, code) =>
  new Promise((resolve, reject) => {
    const data = {
      Phone: to,
      Content: `Your verification code for account ${name} is ${code}`,
      ApiKey: '5E8FBD927304A6396EE3D584E37D7B',
      SecretKey: '5571C068403EEA1A3E3D2E1B27AB05',
      SmsType: 2,
      Brandname: 'Verify',
    };

    instance
      .get('/SendMultipleMessage_V4_get', {
        params: data,
      })
      .then(response => {
        logger.debug(`🔷  eSMS requestId: ${response.data.SMSID}`);
      })
      .catch(error => {
        logger.debug(`🔴  eSMS error: ${error}`);
      });
  });

export { sendConfirmationEsms };
