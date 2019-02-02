import React from 'react';
import { Field } from 'react-final-form';
import RFTextField from '../../../utils/common/form/RFTextField';

const UpdatePasswordFields = ({ submitting, classes }) => {
  return (
    <React.Fragment>
      <Field
        className={classes.field}
        component={RFTextField}
        disabled={submitting}
        name="currentPassword"
        placeholder="Mật khẩu hiện tại"
        type="password"
      />
     <Field component={RFTextField} disabled={submitting} margin="normal" name="password" placeholder="Mật khẩu mới" type="password" />
      <Field
        component={RFTextField}
        disabled={submitting}
        margin="normal"
        name="confirmPassword"
        placeholder="Nhập lại mật khẩu"
        type="password"
      />
    </React.Fragment>
  );
};

export default UpdatePasswordFields;
