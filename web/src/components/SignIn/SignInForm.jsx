/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/prop-types */
import React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import createDecorator from 'final-form-focus';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { Typography, MenuItem } from '@material-ui/core';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import TabContainer from '../../utils/common/form/TabContainer';
import PhoneSelectList from './PhoneSelectList';
import { email, phone, confirm, messages, required } from '../../utils/common/form/validation';
import { countries } from '../../utils/callingcodes';

const focusOnError = createDecorator();

const SignInForm = ({ onSubmit, theme, tabValue, sent, handleChangeIndex, classes }) => (
  <Form
    onSubmit={onSubmit}
    subscription={{ submitting: true }}
    validate={values => {
      let errors = {};
      if (tabValue === 0) {
        errors = required(['email', 'passwordEmail'], values, messages);
        if (!errors.email) {
          const emailError = email(values.email, values);
          if (emailError) {
            errors.email = emailError;
          }
        }
      } else if (tabValue === 1) {
        errors = required(['phone', 'passwordPhone'], values, messages);
        if (!errors.phone) {
          const phoneError = phone(values.countryCode, values.phone);
          if (phoneError) {
            errors.phone = phoneError;
          }
        }
      }
      return errors;
    }}
    decorators={[focusOnError]}
    initialValues={{ countryCode: 'VN' }}
  >
    {({ handleSubmit, values, submitting }) => (
      <form onSubmit={handleSubmit} className={classes.form} noValidate>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            {tabValue === 0 ? (
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
              />
            ) : null}
            {tabValue === 0 ? (
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="passwordEmail"
                autoComplete="current-password"
                label="Mật khẩu"
                type="password"
                margin="normal"
              />
            ) : null}
          </TabContainer>
          <TabContainer dir={theme.direction}>
            {tabValue === 1 ? (
              <Field
                component={PhoneSelectList}
                render={() => countries}
                disabled={submitting || sent}
                fullWidth
                name="countryCode"
                required
                size="large"
              />
            ) : null}
            {tabValue === 1 ? (
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
            ) : null}
            {tabValue === 1 ? (
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
            ) : null}
          </TabContainer>
        </SwipeableViews>
        <FormButton className={classes.button} disabled={submitting || sent} size="large" color="secondary" fullWidth>
          {submitting || sent ? 'Thực hiện...' : 'Đăng nhập'}
        </FormButton>

        <FormSpy subscription={{ values: true }}>
          {({ values }) => <pre>{JSON.stringify(values, undefined, 2)}</pre>}
        </FormSpy>
      </form>
    )}
  </Form>
);

export default SignInForm;
