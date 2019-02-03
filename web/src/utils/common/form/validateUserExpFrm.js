import { required, email, phone, confirm } from './validation';

const validate = expanded => values => {
  let errors = {};
  if (expanded === 'panel2') {
    errors = required(['passwordEmail'], values);
  } else if (expanded === 'panel3') {
    errors = required(['passwordPhone'], values);
  } else if (expanded === 'panel4') {
    errors = required(['password', 'currentPassword'], values);
  }
  if (!errors.confirmPassword) {
    const confirmError = confirm(values.password, values.confirmPassword);
    if (confirmError) {
      errors.confirmPassword = confirmError;
    }
  }
  if (values.email) {
    const emailError = email(values.email, values);
    if (emailError) {
      errors.email = emailError;
    }
  }
  if (values.phone) {
    const phoneError = phone(values.countryCode, values.phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
  }
  return errors;
};
export default validate;
