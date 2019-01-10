/* eslint-disable import/prefer-default-export */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-expressions */
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

export const messages = {
  email: 'email',
  passwordEmail: 'mật khẩu',
  phone: 'số điện thoại',
  passwordPhone: 'mật khẩu',
  nameEmail: 'tên',
  namePhone: 'tên',
  cfrPasswordEmail: 'lại mật khẩu',
  cfrPasswordPhone: 'lại mật khẩu',
};
