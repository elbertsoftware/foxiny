import React from 'react';
import { Field } from 'react-final-form';
import RFTextField from '../../utils/common/form/RFTextField';

const EmailFields = ({ submitting }) => {
  return (
    <React.Fragment>
      <Field
        autoComplete="name"
        component={RFTextField}
        disabled={submitting}
        fullWidth
        label="Tên"
        margin="normal"
        name="nameEmail"
        required
        size="large"
      />
      <Field
        autoComplete="email"
        component={RFTextField}
        disabled={submitting}
        fullWidth
        label="Email"
        margin="normal"
        name="email"
        required
        size="large"
      />
      <Field
        fullWidth
        size="large"
        component={RFTextField}
        disabled={submitting}
        required
        name="passwordEmail"
        autoComplete="current-password"
        label="Mật khẩu"
        type="password"
        margin="normal"
      />
      <Field
        fullWidth
        size="large"
        component={RFTextField}
        disabled={submitting}
        required
        name="cfrPasswordEmail"
        autoComplete="confirm-password"
        label="Nhập lại mật khẩu"
        type="password"
        margin="normal"
      />
    </React.Fragment>
  );
};

export default EmailFields;
