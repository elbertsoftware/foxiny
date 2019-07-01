/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Grid,
  Typography,
  Tabs,
  Tab,
  withStyles,
  CircularProgress,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Icon,
  Zoom,
} from '@material-ui/core';
import { Form, Field, FormSpy } from 'react-final-form';
import { Redirect } from 'react-router';
import { graphql, compose } from 'react-apollo';
import SwipeableViews from 'react-swipeable-views';
import { toast } from 'react-toastify';
import createDecorator from 'final-form-focus';
import { required, email, phone, formatInternationalPhone } from '../../../utils/common/form/validation';
import { countries } from '../../../utils/callingcodes';
import RFTextField from '../../../utils/common/form/RFTextField';
import FormButton from '../../../utils/common/form/FormButton';
import TabContainer from '../../../utils/common/TabContainer';
import registerSellerStyles from './registerSellerStyles';
import SelectList from '../../Form/Fields/SelectList';
import SwipeButton from '../../../utils/SwipeButton';
import { REGISTER_RETAILER } from '../../../graphql/retailer';

const focusOnError = createDecorator();

const RegisterSeller = ({ classes, theme, userLoggedIn, history, ...props }) => {
  // Props from graphql
  const { registerRetailer } = props;
  const [activeTabId, setActiveTabId] = useState(0);
  const [fieldVisible, setFieldVisible] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [isPhoneConfirmed, setIsPhoneConfirmed] = useState(false);
  const handleTabChange = (e, id) => {
    setActiveTabId(id);
  };
  const handleChangeIndex = index => {
    setActiveTabId(index);
  };
  const checkEmailPhone = (usermail, userphone, countryCode) => {
    // Kiểm tra business email và phone này có trùng vs email || phone mà đã đăng ký normal user trước đó không ?
    // Quy trình: Đăng ký normal user > Đăng ký seller.
    const user = userLoggedIn(); // Get from authentication props
    let phoneNumber;
    if (userphone && countryCode) {
      phoneNumber = formatInternationalPhone(userphone, countryCode);
    }
    if (usermail && user.email !== usermail) {
      setIsEmailConfirmed(true);
    } else {
      setIsEmailConfirmed(false);
    }
    if (phoneNumber && user.phone !== phoneNumber) {
      setIsPhoneConfirmed(true);
    } else {
      setIsPhoneConfirmed(false);
    }
  };

  const onSubmit = async values => {
    console.log(values);

    try {
      const phoneNumber = formatInternationalPhone(values.businessPhone, values.countryCode);
      const data = await registerRetailer({
        variables: {
          data: {
            businessName: values.businessName,
            businessEmail: values.businessEmail,
            emailConfirmCode: values.emailCode || '',
            businessPhone: phoneNumber,
            phoneConfirmCode: values.phoneCode || '',
            businessAddress: {
              city: values.businessAddress,
            },
          },
        },
      });
      console.log(data);
      toast.success('Đăng ký thành công !');
      window.location.reload();
      history.push('/sellers/seller-declaration');
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
    }
  };
  if (!userLoggedIn()) {
    return <Redirect to="/seller/sign" />;
  }
  return (
    <Grid container className={classes.container}>
      <div className={classes.logoContainer}>
        <img src="/assets/foxiny_logo.png" alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Foxiny Seller Center</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={activeTabId === 0 ? classes.form : classes.formSellerInfo}>
          <Tabs value={activeTabId} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
            <Tab label="Chọn loại hình" classes={{ root: classes.tab }} />
            <Tab label="Thông tin nhà bán" classes={{ root: classes.tab }} />
          </Tabs>
          <Form
            className={classes.finalForm}
            onSubmit={onSubmit}
            subscription={{ submitting: true, values: true }}
            initialValues={{ countryCode: 84 }}
            decorators={[focusOnError]}
            validate={values => {
              const errors = required(
                ['businessType', 'businessName', 'businessEmail', 'businessPhone', 'businessAddress', 'countryCode'],
                values,
              );
              if (!errors.businessEmail) {
                const emailError = email(values.businessEmail);
                if (emailError) {
                  errors.businessEmail = emailError;
                }
              }
              if (!errors.businessPhone) {
                const phoneError = phone(values.countryCode, values.businessPhone);
                if (phoneError) {
                  errors.businessPhone = phoneError;
                }
              }
              return errors;
            }}
          >
            {({ handleSubmit, submitting, values, pristine, invalid }) => (
              <form onSubmit={handleSubmit} noValidate>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={activeTabId}
                  onChangeIndex={handleChangeIndex}
                >
                  {activeTabId === 0 ? (
                    <TabContainer dir={theme.direction}>
                      <img
                        src="https://static1.squarespace.com/static/54c0e930e4b04b34af20e6eb/5aaab5ce0e2e72851ef48816/5aaab5cf8a922d168f40e308/1521137107827/Drag-and-Drop.png"
                        alt="business-type"
                        className={classes.businessTypeImg}
                      />
                      <Typography className={classes.greeting} gutterBottom variant="h3">
                        Chọn loại hình kinh doanh
                      </Typography>
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel htmlFor="businessType">Loại hình kinh doanh</InputLabel>
                        <Field component={SelectList} disabled={submitting} name="businessType" required size="large">
                          <MenuItem key="personal" value="personal">
                            Cá nhân
                          </MenuItem>
                          <MenuItem key="family" value="family">
                            Hộ gia đình
                          </MenuItem>
                          <MenuItem key="company" value="company">
                            Công ty
                          </MenuItem>
                        </Field>
                      </FormControl>
                      {values.businessType && (
                        <Zoom in={values.businessType !== undefined}>
                          <div className={classes.messagesContainer}>
                            <Typography variant="subtitle2">
                              {values.businessType === 'personal'
                                ? 'Cá nhân từ 18 tuổi trở lên, có CMND còn thời hạn.'
                                : 'Cần có giấy phép đăng ký kinh doanh còn thời hạn.'}
                            </Typography>
                            <Typography variant="subtitle2">
                              📝 <strong>Lưu ý:</strong> Bạn cần phải cung cấp hình ảnh cần thiết cho Foxiny sau khi
                              hoàn tất các bước đăng ký (CMND hai mặt/Giấy phép kinh doanh)
                            </Typography>
                          </div>
                        </Zoom>
                      )}
                      <div className={classes.formButtons}>
                        <Button color="primary" size="large" className={classes.forgetButton}>
                          <Icon>help_outline</Icon> Hỗ trợ
                        </Button>
                        <Button
                          disabled={values.businessType === undefined}
                          onClick={() => setActiveTabId(1)}
                          variant="contained"
                          size="large"
                          color="secondary"
                        >
                          Tiếp tục
                        </Button>
                      </div>
                    </TabContainer>
                  ) : (
                    /* Avoiding raise invalid child: null error from react-swipe-view */
                    <Typography />
                  )}
                  {activeTabId === 1 ? (
                    <TabContainer dir={theme.direction}>
                      <div className={classes.tabContent}>
                        <Typography variant="h1" color="primary" className={classes.greeting}>
                          Xin chào !
                        </Typography>
                        <Typography variant="h3" color="primary" className={classes.subGreeting}>
                          Đăng ký thông tin gian hàng
                        </Typography>
                        <Field
                          className={classes.rightSpacing}
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled={submitting}
                          required
                          name="businessName"
                          label="Tên cửa hàng"
                          type="text"
                          margin="normal"
                        />
                        <Field
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled
                          required
                          name="storeUrl"
                          placeholder="foxiny.vn/cua-hang"
                          type="text"
                          margin="normal"
                        />
                        <div className={classes.fieldRow}>
                          <FormControl className={classes.rightSpacing} fullWidth margin="normal" required>
                            <InputLabel htmlFor="countryCode">Mã quốc gia</InputLabel>
                            <Field
                              component={SelectList}
                              disabled={submitting}
                              name="countryCode"
                              required
                              size="large"
                            >
                              {countries}
                            </Field>
                          </FormControl>
                          <Field
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            required
                            name="businessPhone"
                            label="Số điện thoại cửa hàng"
                            type="text"
                            margin="normal"
                          />
                        </div>
                        <Field
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled={submitting}
                          required
                          name="businessEmail"
                          label="Địa chỉ Email cửa hàng"
                          type="email"
                          margin="normal"
                        />
                        <Field
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled={submitting}
                          required
                          name="businessAddress"
                          label="Địa chỉ"
                          type="text"
                          margin="normal"
                        />
                        {(isEmailConfirmed || isPhoneConfirmed) && (
                          <SwipeButton
                            setFieldVisible={setFieldVisible}
                            email={isEmailConfirmed && values.businessEmail}
                            phone={
                              isPhoneConfirmed && formatInternationalPhone(values.businessPhone, values.countryCode)
                            }
                          />
                        )}
                        {fieldVisible && (
                          <React.Fragment>
                            {isEmailConfirmed && (
                              <Field
                                fullWidth
                                size="large"
                                component={RFTextField}
                                disabled={submitting}
                                required
                                name="emailCode"
                                label="Nhập mã xác thực email"
                                type="email"
                                margin="normal"
                              />
                            )}
                            {isPhoneConfirmed && (
                              <Field
                                fullWidth
                                size="large"
                                component={RFTextField}
                                disabled={submitting}
                                required
                                name="phoneCode"
                                label="Nhập mã xác thực số điện thoại"
                                type="text"
                                margin="normal"
                              />
                            )}
                          </React.Fragment>
                        )}
                        <div className={classes.formButtons}>
                          <Button
                            onClick={() => setActiveTabId(0)}
                            color="primary"
                            size="large"
                            className={classes.forgetButton}
                          >
                            Quay lại
                          </Button>
                          {submitting ? (
                            <CircularProgress size={26} className={classes.loader} />
                          ) : (
                            <FormButton
                              disabled={pristine || invalid}
                              variant="contained"
                              size="large"
                              color="secondary"
                            >
                              Đăng ký
                            </FormButton>
                          )}
                        </div>
                      </div>
                    </TabContainer>
                  ) : (
                    <Typography />
                  )}
                </SwipeableViews>
                <FormSpy
                  subscription={{ values: true, touched: true }}
                  onChange={state => {
                    const { values, touched } = state;
                    if (touched['businessEmail'] || touched['businessPhone']) {
                      checkEmailPhone(values.businessEmail, values.businessPhone, values.countryCode);
                    }
                  }}
                />
              </form>
            )}
          </Form>
        </div>
      </div>
    </Grid>
  );
};

export default compose(
  graphql(REGISTER_RETAILER, { name: 'registerRetailer' }),
  withStyles(registerSellerStyles, { withTheme: true }),
)(RegisterSeller);
