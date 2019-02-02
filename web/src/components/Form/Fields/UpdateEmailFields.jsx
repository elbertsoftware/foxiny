import React from 'react';
import { Field } from 'react-final-form';
import RFTextField from '../../../utils/common/form/RFTextField';

const UpdateEmailFields = ({ submitting, classes }) => {
  return (
    <React.Fragment>
      <Field
        className={classes.field}
        component={RFTextField}
        disabled={submitting}
        name="email"
        placeholder="Email mới"
      />
      <Field
        component={RFTextField}
        disabled={submitting}
        name="passwordEmail"
        margin="normal"
        placeholder="Mật khẩu"
        type="password"
      />
    </React.Fragment>
  );
};

export default UpdateEmailFields;
