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
import { Typography, FormHelperText } from '@material-ui/core';
import { ReCaptcha } from 'react-recaptcha-google';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import TabContainer from '../../utils/common/form/TabContainer';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import {
  email,
  phone,
  required,
  confirm,
  messages,
  formatInternationalPhone,
  captChaVerification,
} from '../../utils/common/form/validation';
import PhoneFields from './PhoneFields';
import EmailFields from './EmailFields';

const focusOnError = createDecorator();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const CREATE_USER = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      enabled
    }
  }
`;

const initData = {
  nameEmail: '',
  email: '',
  passwordEmail: '',
  cfrPasswordEmail: '',
  namePhone: '',
  phone: '',
  passwordPhone: '',
  cfrPasswordPhone: '',
  countryCode: 84,
};

let resetForm;

class SignUpForm extends React.Component {
  state = {
    initData: {},
    verified: true,
    captchaResponse: '',
    error: null,
  };

  recaptchaRef = React.createRef();

  signupRef = React.createRef();

  componentDidMount() {
    this.setState({ loading: true });

    this.setState({ initData });
    // captcha
    if (this.recaptchaRef) {
      console.log('started, just a second...');
      this.recaptchaRef.current.reset();
    }
    this.setState({ loading: false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tabValue !== nextProps.tabValue) {
      resetForm();
    }
  }

  resetForm = () => {
    document.getElementById('myForm').dispatchEvent(new Event('reset', { cancelable: true }));
  };

  onSubmit = ({ createUser }) => async values => {
    // Checked Captcha or not
    const capRes = this.state.captchaResponse;
    if (capRes.length !== 0) {
      this.recaptchaRef.current.reset();
    } else {
      this.setState({
        verified: false,
      });
      return;
    }

    const result = await captChaVerification(this.state.captchaResponse);
    if (!result.data.success) return; // Notify message for user, using Toast later

    let data;
    try {
      if (values.email) {
        data = await createUser({
          variables: {
            data: {
              name: values.nameEmail,
              email: values.email,
              password: values.passwordEmail,
            },
          },
        });
      } else {
        const phoneNumber = formatInternationalPhone(values.phone, values.countryCode);
        data = await createUser({
          variables: {
            data: {
              name: values.namePhone,
              phone: phoneNumber,
              password: values.passwordPhone,
            },
          },
        });
      }
      this.props.history.push(`/confirm/${data.data.createUser.id}`);
    } catch (error) {
      throw new Error(error.messages);
    }
  };

  onLoadRecaptcha = () => {
    setTimeout(() => {
      if (this.recaptchaRef) {
        this.recaptchaRef.current.reset();
      }
    }, 0);
  };

  verifyCallback = recaptchaToken => {
    this.setState({
      captchaResponse: recaptchaToken,
    });
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, '<= your recaptcha token');
  };

  render() {
    const { theme, tabValue, handleChangeIndex, classes } = this.props;
    const { loading, initData, error } = this.state;
    return (
      <Mutation mutation={CREATE_USER}>
        {(createUser, { data, loading, error }) => (
          <React.Fragment>
            <Form
              onSubmit={this.onSubmit({ createUser })}
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
              initialValues={this.state.initData}
            >
              {({ handleSubmit, values, submitting, reset }) => {
                resetForm = reset;
                return (
                  <form id="myForm" ref={this.signupRef} onSubmit={handleSubmit} className={classes.form} noValidate>
                    {loading && <p>Loading...</p>}
                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={tabValue}
                      onChangeIndex={handleChangeIndex}
                      style={{ marginBottom: '16px' }}
                    >
                      <TabContainer dir={theme.direction}>
                        {tabValue === 0 ? <EmailFields submitting={submitting} /> : ' '}
                      </TabContainer>
                      <TabContainer dir={theme.direction}>
                        {tabValue === 1 ? <PhoneFields submitting={submitting} /> : ' '}
                      </TabContainer>
                    </SwipeableViews>
                    <ReCaptcha
                      ref={this.recaptchaRef}
                      size="normal"
                      render="explicit"
                      sitekey="6Lc8fIoUAAAAAEIelPYBBoehOd00PSDckbO75rhh"
                      hl="vi"
                      onloadCallback={this.onLoadRecaptcha}
                      verifyCallback={this.verifyCallback}
                    />
                    {!this.state.verified && (
                      <FormHelperText id="component-error-text" error>
                        Vui lòng xác nhận bạn không phải là người máy
                      </FormHelperText>
                    )}
                    <FormButton
                      className={classes.button}
                      disabled={submitting}
                      size="large"
                      color="secondary"
                      fullWidth
                    >
                      {submitting ? 'Thực hiện...' : 'Đăng ký'}
                    </FormButton>
                    <FormSpy subscription={{ values: true }}>
                      {({ values }) => <pre>{JSON.stringify(values, undefined, 2)}</pre>}
                    </FormSpy>
                  </form>
                );
              }}
            </Form>
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export default SignUpForm;
