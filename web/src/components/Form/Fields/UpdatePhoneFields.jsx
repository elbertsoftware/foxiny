import React from 'react';
import { Field } from 'react-final-form';
import SelectList from './SelectList';
import { countries } from '../../../utils/callingcodes';
import RFTextField from '../../../utils/common/form/RFTextField';

const UpdatePhoneFields = ({ submitting, classes }) => {
  return (
    <React.Fragment>
      <Field
        className={classes.field}
        component={SelectList}
        disabled={submitting}
        name="countryCode"
        required
        size="large"
      >
        {countries}
      </Field>
      <Field component={RFTextField} disabled={submitting} name="phone" margin="normal" placeholder="SĐT mới" />
      <Field
        component={RFTextField}
        disabled={submitting}
        name="passwordPhone"
        margin="normal"
        placeholder="Mật khẩu"
        type="password"
      />
    </React.Fragment>
  );
};

export default UpdatePhoneFields;
