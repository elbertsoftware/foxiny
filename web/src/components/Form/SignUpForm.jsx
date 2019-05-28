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
import { toast } from 'react-toastify';
import TabContainer from '../../utils/common/TabContainer';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import {
  email,
  phone,
  required,
  confirm,
  formatInternationalPhone,
  captChaVerification,
} from '../../utils/common/form/validation';
import PhoneFields from './Fields/PhoneFields';
import EmailFields from './Fields/EmailFields';

const focusOnError = createDecorator();
const CREATE_USER = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      enabled
    }
  }
`;

const initData = {
  countryCode: 84,
};

let resetForm;

class SignUpForm extends React.Component {
  state = {
    initData: {},
    verified: true,
    captchaResponse: '',
  };

  recaptchaRef = React.createRef();

  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ initData });
    // captcha
    if (this.recaptchaRef) {
      this.recaptchaRef.current.reset();
    }
    this.setState({ loading: false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tabValue !== nextProps.tabValue) {
      resetForm();
    }
  }

  onSubmit = ({ createUser }) => async values => {
    // sellerCenter: bool, setUserId va setActiveTabId là phương thức để setState trong trang đăng ký của SellerCenter, được truyền từ component SignView
    const { sellerCenter, history, setUserId, setActiveTabId } = this.props;
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
    if (!result.data.success) {
      toast.error('Đăng ký không thành công !');
      return;
    }

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
      } else if (values.phone) {
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
      const userId = data.data.createUser.id;
      if (sellerCenter) {
        // Nếu đăng ký ở seller center thì lưu lại user id và chuyển sang bước tiếp theo để đăng ký gian hàng
        setUserId(userId);
        // Tab hiển thị confirm user ở seller center mặc định mang giá trị là 2
        setActiveTabId(2);
      } else {
        // Ngước lại normal user thi điều hướng đến trang route confirm
        history.push(`/confirm/${userId}`);
      }
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Đăng ký không thành công !');
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
                  errors = required(['email', 'passwordEmail', 'nameEmail', 'cfrPasswordEmail'], values);
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
                  errors = required(['phone', 'passwordPhone', 'namePhone', 'cfrPasswordPhone'], values);
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
              {({ handleSubmit, values, submitting, form: { reset } }) => {
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
