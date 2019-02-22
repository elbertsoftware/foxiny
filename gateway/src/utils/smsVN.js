import axios from 'axios';
import logger from './logger';

// instance of axios
const instance = axios.create({
  baseURL: 'http://rest.esms.vn/MainService.svc/json',
});

const sendConfirmationEsms = (phone, code) => {
  const data = {
    Phone: phone,
    Content: 'Your verification code is ' + code,
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
      logger.debug(`eSMS requestId: ${response.data.SMSID}`);
      return true;
    })
    .catch(error => {
      logger.debug(`eSMS error: ${error}`);
      return false;
    });
};

export { sendConfirmationEsms };
