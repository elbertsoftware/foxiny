/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/prop-types */
import React from 'react';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { Typography, MenuItem } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import TabContainer from '../../utils/common/TabContainer';
import SelectList from './Fields/SelectList';
import { email, phone, required, formatInternationalPhone } from '../../utils/common/form/validation';
import { countries } from '../../utils/callingcodes';
import { setAuthorizationToken, setUserInfo } from '../../utils/authentication';

const focusOnError = createDecorator();

const LOGIN = gql`
  mutation login($data: LoginUserInput!) {
    login(data: $data) {
      userId
      token
    }
  }
`;

const initData = {
  countryCode: 84,
};

let resetForm;

class SignInForm extends React.Component {
  state = {
    initData: {},
  };

  componentDidMount() {
    this.setState({ initData });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tabValue !== nextProps.tabValue) {
      resetForm();
    }
  }

  onSubmit = async values => {
    const { login } = this.props;
    let data;
    try {
      if (values.email) {
        data = await login({
          variables: {
            data: {
              email: values.email,
              password: values.passwordEmail,
            },
          },
        });
      } else if (values.phone) {
        const phoneNumber = formatInternationalPhone(values.phone, values.countryCode);
        data = await login({
          variables: {
            data: {
              phone: phoneNumber,
              password: values.passwordPhone,
            },
          },
        });
      }
      const { userId, token } = data.data.login;
      if (token) {
        setAuthorizationToken(token);
        if (this.props.sellerCenter) {
          this.props.history.push('/sellers/register-seller');
        } else {
          this.props.history.push('/');
        }
      }
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi khi đăng nhập !');
    }
  };

  render() {
    const { theme, tabValue, handleChangeIndex, classes } = this.props;
    return (
      <Form
        onSubmit={this.onSubmit}
        subscription={{ submitting: true }}
        validate={values => {
          let errors = {};
          if (tabValue === 0) {
            errors = required(['email', 'passwordEmail'], values);
            if (!errors.email) {
              const emailError = email(values.email, values);
              if (emailError) {
                errors.email = emailError;
              }
            }
          } else if (tabValue === 1) {
            errors = required(['phone', 'passwordPhone'], values);
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
        initialValues={this.state.initData}
      >
        {({ handleSubmit, values, submitting, form: { reset } }) => {
          resetForm = reset;
          return (
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
                      disabled={submitting}
                      fullWidth
                      label="Email"
                      margin="normal"
                      name="email"
                      required
                      size="large"
                    />
                  ) : (
                    ''
                  )}
                  {tabValue === 0 ? (
                    <Field
                      fullWidth
                      size="large"
                      component={RFTextField}
                      disabled={submitting}
                      required
                      name="passwordEmail"
                      autoComplete="current-password"
                      label="Mật khẩu"
                      type="password"
                      margin="normal"
                    />
                  ) : (
                    ''
                  )}
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  {tabValue === 1 ? (
                    <Field
                      component={SelectList}
                      disabled={submitting}
                      fullWidth
                      name="countryCode"
                      required
                      size="large"
                    >
                      {countries}
                    </Field>
                  ) : (
                    ''
                  )}
                  {tabValue === 1 ? (
                    <Field
                      autoComplete="phone"
                      component={RFTextField}
                      disabled={submitting}
                      fullWidth
                      label="Phone"
                      margin="normal"
                      name="phone"
                      required
                      size="large"
                    />
                  ) : (
                    ''
                  )}
                  {tabValue === 1 ? (
                    <Field
                      fullWidth
                      size="large"
                      component={RFTextField}
                      disabled={submitting}
                      required
                      name="passwordPhone"
                      autoComplete="current-password"
                      label="Mật khẩu"
                      type="password"
                      margin="normal"
                    />
                  ) : (
                    ''
                  )}
                </TabContainer>
              </SwipeableViews>
              <FormButton className={classes.button} disabled={submitting} size="large" color="secondary" fullWidth>
                {submitting ? 'Thực hiện...' : 'Đăng nhập'}
              </FormButton>
            </form>
          );
        }}
      </Form>
    );
  }
}

export default compose(graphql(LOGIN, { name: 'login' }))(SignInForm);
