/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-expressions */
import isEmail from 'validator/lib/isEmail';

export const email = value => {
  return value && !isEmail(value.trim()) ? 'Email không hợp lệ.' : null;
};

const isDirty = value => value || value === 0;

export const required = (requiredFields, values, messages) =>
  requiredFields.reduce((fields, field) => {
    return {
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: `Vui lòng nhập ${messages[field]}` }),
    };
  }, {});

export const validate = values => {
  const messages = {
    email: 'email',
    password: 'mật khẩu',
    phone: 'số điện thoại',
  };
  const errors = required(['email', 'password', 'phone'], values, messages);
  if (!errors.email) {
    const emailError = email(values.email, values);
    if (emailError) {
      errors.email = email(values.email, values);
    }
  }

  return errors;
};
