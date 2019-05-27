/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Grid, Typography, Tabs, Tab, withStyles, CircularProgress, Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import classnames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import RFTextField from '../../../utils/common/form/RFTextField';
import FormButton from '../../../utils/common/form/FormButton';
import TabContainer from '../../../utils/common/TabContainer';
import google from '../../../images/google.svg';
import signStyles from './signStyles';

const Sign = ({ classes, theme }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const handleTabChange = (e, id) => {
    setActiveTabId(id);
  };
  const handleChangeIndex = index => {
    setActiveTabId(index);
  };

  const onSubmit = async values => {};
  return (
    <Grid container className={classes.container}>
      <div className={classes.logoContainer}>
        <img src="/assets/foxiny_logo.png" alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Foxiny Seller Center</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={activeTabId === 0 ? classes.form : classes.formRegister}>
          <Tabs value={activeTabId} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
            <Tab label="Đăng nhập" classes={{ root: classes.tab }} />
            <Tab label="Đăng ký" classes={{ root: classes.tab }} />
          </Tabs>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, submitting, form: { reset } }) => {
              return (
                <form onSubmit={handleSubmit} noValidate>
                  <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeTabId}
                    onChangeIndex={handleChangeIndex}
                  >
                    {activeTabId === 0 ? (
                      <TabContainer dir={theme.direction}>
                        <Typography variant="h1" className={classes.greeting}>
                          Xin chào bạn
                        </Typography>
                        <Button size="large" className={classes.googleButton}>
                          <img src={google} alt="google" className={classes.googleIcon} />
                          &nbsp;Sign in with Google
                        </Button>
                        <div className={classes.formDividerContainer}>
                          <div className={classes.formDivider} />
                          <Typography className={classes.formDividerWord}>or</Typography>
                          <div className={classes.formDivider} />
                        </div>

                        <Field
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled={submitting}
                          required
                          name="username"
                          label="Địa chỉ Email"
                          type="text"
                          margin="normal"
                        />
                        <Field
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled={submitting}
                          required
                          name="password"
                          label="Mật khẩu"
                          type="text"
                          margin="normal"
                        />
                        <div className={classes.formButtons}>
                          {submitting ? (
                            <CircularProgress size={26} className={classes.loginLoader} />
                          ) : (
                            <FormButton size="large" color="secondary" disabled={submitting}>
                              Đăng nhập
                            </FormButton>
                          )}

                          <Button color="primary" size="large" className={classes.forgetButton}>
                            Quên mật khẩu
                          </Button>
                        </div>
                      </TabContainer>
                    ) : (
                      /* Avoiding raise invalid child: null error from react-swipe-view */
                      <Typography />
                    )}
                    {activeTabId === 1 ? (
                      <TabContainer dir={theme.direction}>
                        <Typography variant="h1" color="primary" className={classes.greeting}>
                          Xin chào !
                        </Typography>
                        <Typography variant="h2" color="primary" className={classes.subGreeting}>
                          Tạo tài khoản Seller mới
                        </Typography>
                        <div className={classes.fieldRow}>
                          <Field
                            className={classes.rightSpacing}
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            required
                            name="name"
                            label="Họ tên chủ cửa hàng"
                            type="text"
                            margin="normal"
                          />
                          <Field
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            required
                            name="phone"
                            label="Số điện thoại cửa hàng"
                            type="text"
                            margin="normal"
                          />
                        </div>
                        <div className={classes.fieldRow}>
                          <Field
                            className={classes.rightSpacing}
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            required
                            name="address"
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
                            name="password"
                            label="Mật khẩu"
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
                          name="storename"
                          label="Tên cửa hàng"
                          type="text"
                          margin="normal"
                        />
                        <Field
                          fullWidth
                          size="large"
                          component={RFTextField}
                          disabled={submitting}
                          required
                          name="storeUrl"
                          placeholder="foxiny.vn/cua-hang"
                          type="text"
                          margin="normal"
                        />
                        <div className={classes.fieldRow}>
                          <Field
                            className={classes.rightSpacing}
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            required
                            name="businessCode"
                            label="Mã số đăng ký kinh doanh"
                            type="text"
                            margin="normal"
                          />
                          <Field
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            required
                            name="city"
                            label="Tỉnh/Thành phố"
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
                          name="sector"
                          label="Chọn ngành hàng"
                          type="text"
                          margin="normal"
                        />
                        <div className={classes.creatingButtonContainer}>
                          {submitting ? (
                            <CircularProgress size={26} />
                          ) : (
                            <Button
                              disabled={submitting}
                              size="large"
                              variant="contained"
                              color="primary"
                              fullWidth
                              className={classes.createAccountButton}
                            >
                              Đăng ký
                            </Button>
                          )}
                        </div>
                        <div className={classes.formDividerContainer}>
                          <div className={classes.formDivider} />
                          <Typography className={classes.formDividerWord}>or</Typography>
                          <div className={classes.formDivider} />
                        </div>
                        <Button size="large" className={classnames(classes.googleButton, classes.googleButtonCreating)}>
                          <img src={google} alt="google" className={classes.googleIcon} />
                          &nbsp;Đăng nhập với Google
                        </Button>
                      </TabContainer>
                    ) : (
                      <Typography />
                    )}
                  </SwipeableViews>
                </form>
              );
            }}
          </Form>
        </div>
      </div>
    </Grid>
  );
};

export default withStyles(signStyles, { withTheme: true })(Sign);
