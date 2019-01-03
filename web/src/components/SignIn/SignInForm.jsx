/* eslint-disable no-confusing-arrow */
/* eslint-disable react/prop-types */
import React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { Typography, MenuItem } from '@material-ui/core';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import FormFeedback from '../../utils/common/form/FormFeedback';
import PhoneSelectList from './PhoneSelectList';
import callingCodes from '../../utils/callingcodes';

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
  <MenuItem key={country} value={value}>{`${country} ${value}`}</MenuItem>
));

const SignInForm = ({
  handleSubmit,
  validate,
  focusOnError,
  theme,
  tabValue,
  sent,
  handleChangeIndex,
  classes,
  handleSelectChange,
}) => (
  <Form onSubmit={handleSubmit} subscription={{ submitting: true }} validate={validate} decorators={[focusOnError]}>
    {({ values, submitting }) => (
      <form onSubmit={handleSubmit} className={classes.form} noValidate>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <Field
              autoComplete="email"
              autoFocus
              component={RFTextField}
              disabled={submitting || sent}
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              required
              size="large"
            />
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <Field
              autoFocus
              component={PhoneSelectList}
              render={() => countries}
              disabled={submitting || sent}
              fullWidth
              name="postalList"
              required
              size="large"
            />
            <Field
              autoComplete="phone"
              autoFocus
              component={RFTextField}
              disabled={submitting || sent}
              fullWidth
              label="Phone"
              margin="normal"
              name="phone"
              required
              size="large"
            />
          </TabContainer>
        </SwipeableViews>

        <Field
          fullWidth
          size="large"
          component={RFTextField}
          disabled={submitting || sent}
          required
          name="password"
          autoComplete="current-password"
          label="Mật khẩu"
          type="password"
          margin="normal"
        />
        <FormSpy subscription={{ submitError: true }}>
          {({ submitError }) =>
            submitError ? (
              <FormFeedback className={classes.feedback} error>
                {submitError}
              </FormFeedback>
            ) : null
          }
        </FormSpy>
        <FormButton className={classes.button} disabled={submitting || sent} size="large" color="secondary" fullWidth>
          {submitting || sent ? 'Thực hiện...' : 'Đăng nhập'}
        </FormButton>
        <pre>{JSON.stringify(values, undefined, 2)}</pre>
      </form>
    )}
  </Form>
);

export default SignInForm;
