/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/prop-types */
import React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import createDecorator from 'final-form-focus';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { Typography } from '@material-ui/core';
import { ReCaptcha } from 'react-recaptcha-google';
import RFTextField from '../../utils/common/form/RFTextField';
import TabContainer from '../../utils/common/form/TabContainer';
import FormButton from '../../utils/common/form/FormButton';
import PhoneSelectList from '../SignIn/PhoneSelectList';
import { email, phone, required, confirm, messages } from '../../utils/common/form/validation';
import { countries } from '../../utils/callingcodes';

const focusOnError = createDecorator();

class SignUpForm extends React.Component {
  state = {
    data: {},
  };

  componentDidMount() {
    this.setState({ loading: true });
    const data = {
      countryCode: 'VN',
    };
    this.setState({ data });
    this.setState({ loading: false });
    // captcha
    if (this.captchaDemo) {
      console.log('started, just a second...');
      this.captchaDemo.reset();
    }
  }

  onLoadRecaptcha = () => {
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  };

  verifyCallback = recaptchaToken => {
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, '<= your recaptcha token');
  };

  render() {
    const { onSubmit, theme, tabValue, sent, handleChangeIndex, classes } = this.props;
    const { loading, data } = this.state;
    return (
      <Form
        onSubmit={onSubmit}
        subscription={{ submitting: true }}
        validate={values => {
          let errors = {};
          if (tabValue === 0) {
            errors = required(['email', 'passwordEmail', 'nameEmail', 'cfrPasswordEmail'], values, messages);
            if (!errors.email) {
              const emailError = email(values.email, values);
              if (emailError) {
                errors.email = emailError;
              }
            }
            if (!errors.cfrPasswordEmail) {
              const confirmError = confirm(values.passwordEmail, values.cfrPasswordEmail);
              if (confirmError) {
                errors.cfrPasswordEmail = confirmError;
              }
            }
          } else if (tabValue === 1) {
            errors = required(['phone', 'passwordPhone', 'namePhone', 'cfrPasswordPhone'], values, messages);
            if (!errors.phone) {
              const phoneError = phone(values.countryCode, values.phone);
              if (phoneError) {
                errors.phone = phoneError;
              }
            }
            if (!errors.cfrPasswordPhone) {
              const confirmError = confirm(values.passwordPhone, values.cfrPasswordPhone);
              if (confirmError) {
                errors.cfrPasswordPhone = confirmError;
              }
            }
          }
          return errors;
        }}
        decorators={[focusOnError]}
        initialValues={data}
      >
        {({ handleSubmit, values, submitting }) => (
          <form onSubmit={handleSubmit} className={classes.form} noValidate>
            {loading && <p>Loading...</p>}
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={tabValue}
              onChangeIndex={handleChangeIndex}
            >
              <TabContainer dir={theme.direction}>
                {tabValue === 0 ? (
                  <Field
                    autoComplete="name"
                    component={RFTextField}
                    disabled={submitting || sent}
                    fullWidth
                    label="Tên"
                    margin="normal"
                    name="nameEmail"
                    required
                    size="large"
                  />
                ) : null}
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
                {tabValue === 0 ? (
                  <Field
                    fullWidth
                    size="large"
                    component={RFTextField}
                    disabled={submitting || sent}
                    required
                    name="cfrPasswordEmail"
                    autoComplete="confirm-password"
                    label="Nhập lại mật khẩu"
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
                {tabValue === 1 ? (
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
                ) : null}
              </TabContainer>
            </SwipeableViews>
            <ReCaptcha
              ref={el => {
                this.captchaDemo = el;
              }}
              size="normal"
              render="explicit"
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onloadCallback={this.onLoadRecaptcha}
              verifyCallback={this.verifyCallback}
            />
            <FormButton
              className={classes.button}
              disabled={submitting || sent}
              size="large"
              color="secondary"
              fullWidth
            >
              {submitting || sent ? 'Thực hiện...' : 'Đăng ký'}
            </FormButton>

            <FormSpy subscription={{ values: true }}>
              {({ values }) => <pre>{JSON.stringify(values, undefined, 2)}</pre>}
            </FormSpy>
          </form>
        )}
      </Form>
    );
  }
}

export default SignUpForm;
