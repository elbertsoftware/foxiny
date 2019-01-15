import React from 'react';
import { Field } from 'react-final-form';
import RFTextField from '../../utils/common/form/RFTextField';
import PhoneSelectList from '../SignIn/PhoneSelectList';
import { countries } from '../../utils/callingcodes';

const PhoneFields = ({ submitting, sent }) => {
  return (
    <React.Fragment>
      <Field
        component={PhoneSelectList}
        disabled={submitting || sent}
        fullWidth
        name="countryCode"
        required
        size="large"
      >
        {countries}
      </Field>

      <Field
        autoComplete="name"
        component={RFTextField}
        disabled={submitting || sent}
        fullWidth
        label="Tên"
        margin="normal"
        name="namePhone"
        required
        size="large"
      />
      <Field
        autoComplete="phone"
        component={RFTextField}
        disabled={submitting || sent}
        fullWidth
        label="Phone"
        margin="normal"
        name="phone"
        required
        size="large"
      />
      <Field
        fullWidth
        size="large"
        component={RFTextField}
        disabled={submitting || sent}
        required
        name="passwordPhone"
        autoComplete="current-password"
        label="Mật khẩu"
        type="password"
        margin="normal"
      />
      <Field
        fullWidth
        size="large"
        component={RFTextField}
        disabled={submitting || sent}
        required
        name="cfrPasswordPhone"
        autoComplete="confirm-password"
        label="Nhập lại mật khẩu"
        type="password"
        margin="normal"
      />
    </React.Fragment>
  );
};

export default PhoneFields;
