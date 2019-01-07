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
import PhoneSelectList from './PhoneSelectList';
import { validate } from '../../utils/common/form/validation';
import { callingCodes } from '../../utils/callingcodes';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const countries = callingCodes.map(({ country, value, code }) => (
  <MenuItem key={country} value={code}>{`${country} + ${value}`}</MenuItem>
));

const focusOnError = createDecorator();

const SignInForm = ({ handleSubmitEmail, handleSubmitPhone, theme, tabValue, sent, handleChangeIndex, classes }) => (
  <SwipeableViews
    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
    index={tabValue}
    onChangeIndex={handleChangeIndex}
  >
    <TabContainer dir={theme.direction}>
      <Form
        onSubmit={handleSubmitEmail}
        subscription={{ submitting: true }}
        validate={validate}
        decorators={[focusOnError]}
      >
        {({ handleSubmit, values, submitting }) => (
          <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
            <FormButton
              className={classes.button}
              disabled={submitting || sent}
              size="large"
              color="secondary"
              fullWidth
            >
              {submitting || sent ? 'Thực hiện...' : 'Đăng nhập'}
            </FormButton>
            <FormSpy subscription={{ values: true }}>
              {({ values }) => <pre>{JSON.stringify(values, undefined, 2)}</pre>}
            </FormSpy>
          </form>
        )}
      </Form>
    </TabContainer>
    <TabContainer dir={theme.direction}>
      <Form
        onSubmit={handleSubmitPhone}
        subscription={{ submitting: true }}
        validate={validate}
        decorators={[focusOnError]}
        initialValues={{ countryCode: 'VN' }}
      >
        {({ handleSubmit, values, submitting }) => (
          <form onSubmit={handleSubmit} className={classes.form} noValidate>
            {countries && (
              <Field
                component={PhoneSelectList}
                render={() => countries}
                disabled={submitting || sent}
                fullWidth
                name="countryCode"
                required
                size="large"
              />
            )}
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
            <FormButton
              className={classes.button}
              disabled={submitting || sent}
              size="large"
              color="secondary"
              fullWidth
            >
              {submitting || sent ? 'Thực hiện...' : 'Đăng nhập'}
            </FormButton>
            <FormSpy subscription={{ values: true }}>
              {({ values }) => <pre>{JSON.stringify(values, undefined, 2)}</pre>}
            </FormSpy>
          </form>
        )}
      </Form>
    </TabContainer>
  </SwipeableViews>
);

export default SignInForm;
