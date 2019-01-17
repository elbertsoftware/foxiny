/* eslint-disable import/prefer-default-export */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-expressions */
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import { regex } from '../../callingcodes';

export const email = value => {
  return value && !isEmail(value.trim()) ? 'Email không hợp lệ.' : null;
};

export const phone = (countryCode, str) => {
  if (Object.prototype.hasOwnProperty.call(regex, countryCode)) {
    const phoneRegex = new RegExp(regex[countryCode]);
    if (phoneRegex.test(str)) {
      return null;
    }
  }
  return 'Số điện thoại không hợp lệ.';
};

export const formatInternationalPhone = (phoneNumber, countryCode) => {
  // Vietnam
  if (phoneNumber.startsWith('0')) {
    return phoneNumber.replace(/^0+(?=\d)/, `+${countryCode}`);
  }
  // US
  if (phoneNumber.startsWith('1')) {
    return phoneNumber.replace(/^1+(?=\d)/, `+${countryCode}`);
  }
  return phoneNumber;
};

export const confirm = (firstVal, secondVal) => {
  if (firstVal !== secondVal) {
    return 'Mật khẩu không khớp';
  }
  return null;
};

const isDirty = value => value || value === 0;

export const required = (requiredFields, values, messages) =>
  requiredFields.reduce((fields, field) => {
    return {
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: `Vui lòng nhập ${messages[field]}` }),
    };
  }, {});

const SECRET_KEY = '6Lc8fIoUAAAAALu3ueS_-bQfud-YeAGq2QFlBCpS';

export const captChaVerification = async (captchaResponse, secretKey = SECRET_KEY) => {
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
  const result = await axios.post(proxyurl + url, undefined, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });
  return result;
};

export const messages = {
  email: 'email',
  passwordEmail: 'mật khẩu',
  phone: 'số điện thoại',
  passwordPhone: 'mật khẩu',
  nameEmail: 'tên',
  namePhone: 'tên',
  cfrPasswordEmail: 'lại mật khẩu',
  cfrPasswordPhone: 'lại mật khẩu',
  confirmCode: 'mã xác thực',
};
