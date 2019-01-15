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
import { email, phone, required, confirm, messages } from '../../utils/common/form/validation';
import PhoneFields from './PhoneFields';
import EmailFields from './EmailFields';

const focusOnError = createDecorator();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const recaptchaRef = React.createRef();
const CREATE_USER = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      enabled
    }
  }
`;

class SignUpForm extends React.Component {
  state = {
    initData: {},
    verified: true,
  };

  componentDidMount() {
    this.setState({ loading: true });
    const initData = {
      countryCode: 'VN',
    };
    this.setState({ initData });
    // captcha
    if (recaptchaRef) {
      console.log('started, just a second...');
      recaptchaRef.current.reset();
    }
    this.setState({ loading: false });
  }

  onSubmit = ({ createUser }) => async values => {
    // Captcha validation
    const capRes = window.grecaptcha.getResponse();
    if (capRes.length) {
      recaptchaRef.current.reset();
    } else {
      this.setState({
        verified: false,
      });
      return;
    }
    createUser({
      variables: {
        data: {
          name: values.nameEmail,
          email: values.email,
          password: values.passwordEmail,
        },
      },
    })
      .then(({ data }) => {
        console.log(data);
        this.props.history.push(`/confirm/${data.createUser.id}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  onLoadRecaptcha = () => {
    setTimeout(() => {
      if (recaptchaRef) {
        recaptchaRef.current.reset();
      }
    }, 0);
  };

  verifyCallback = recaptchaToken => {
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, '<= your recaptcha token');
  };

  render() {
    const { theme, tabValue, sent, handleChangeIndex, classes } = this.props;
    const { loading, initData } = this.state;
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
              initialValues={initData}
            >
              {({ handleSubmit, values, submitting }) => (
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  {loading && <p>Loading...</p>}
                  <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleChangeIndex}
                    style={{ marginBottom: '16px' }}
                  >
                    <TabContainer dir={theme.direction}>
                      {tabValue === 0 ? <EmailFields submitting={submitting} sent={sent} /> : ' '}
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                      {tabValue === 1 ? <PhoneFields submitting={submitting} sent={sent} /> : ' '}
                    </TabContainer>
                  </SwipeableViews>
                  <ReCaptcha
                    ref={recaptchaRef}
                    size="normal"
                    render="explicit"
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
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
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export default SignUpForm;
