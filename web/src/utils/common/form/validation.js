/* eslint-disable import/prefer-default-export */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-expressions */
import isEmail from 'validator/lib/isEmail';
import { regex } from '../../callingcodes';

const email = value => {
  return value && !isEmail(value.trim()) ? 'Email không hợp lệ.' : null;
};

const phone = (countryCode, str) => {
  if (Object.prototype.hasOwnProperty.call(regex, countryCode)) {
    const phoneRegex = new RegExp(regex[countryCode]);
    if (phoneRegex.test(str)) {
      return null;
    }
  }
  return 'Số điện thoại không hợp lệ.';
};

const isDirty = value => value || value === 0;

const required = (requiredFields, values, messages) =>
  requiredFields.reduce((fields, field) => {
    return {
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: `Vui lòng nhập ${messages[field]}` }),
    };
  }, {});

export const validate = values => {
  const messages = {
    email: 'email',
    passwordEmail: 'mật khẩu',
    phone: 'số điện thoại',
    passwordPhone: 'mật khẩu',
  };
  const errors = required(['email', 'passwordEmail', 'phone', 'passwordPhone'], values, messages);
  if (!errors.email) {
    const emailError = email(values.email, values);
    if (emailError) {
      errors.email = email(values.email, values);
    }
  }
  if (!errors.phone) {
    const phoneError = phone(values.countryCode, values.phone);
    if (phoneError) {
      errors.phone = phone(values.countryCode, values.phone);
    }
  }

  return errors;
};
