/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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
} from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';
import SwipeableViews from 'react-swipeable-views';
import { toast } from 'react-toastify';
import RFTextField from '../../../utils/common/form/RFTextField';
import FormButton from '../../../utils/common/form/FormButton';
import TabContainer from '../../../utils/common/TabContainer';
import registerSellerStyles from './registerSellerStyles';
import SelectList from '../../Form/Fields/SelectList';

const REGISTER_RETAILER = gql`
  mutation registerRetailer($data: RegisterRetailer!) {
    registerRetailer(data: $data) {
      id
      businessName
      businessPhone
      businessEmail
      enabled
      createdAt
      updatedAt
    }
  }
`;

const RegisterSeller = ({ classes, theme, ...props }) => {
  // Props from graphql
  const { registerRetailer } = props;
  const [activeTabId, setActiveTabId] = useState(0);
  const handleTabChange = (e, id) => {
    setActiveTabId(id);
  };
  const handleChangeIndex = index => {
    setActiveTabId(index);
  };

  const onSubmit = async values => {
    try {
      await registerRetailer({
        variables: {
          data: {
            businessName: values.businessName,
            businessEmail: values.businessEmail,
            businessPhone: values.businessPhone,
            businessAddress: {
              city: values.businessAddress,
            },
          },
        },
      });
      toast.success('Đăng ký thành công !');
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
    }
  };
  return (
    <Grid container className={classes.container}>
      <div className={classes.logoContainer}>
        <img src="/assets/foxiny_logo.png" alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Foxiny Seller Center</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={activeTabId === 0 ? classes.form : classes.formSellerInfo}>
          <Tabs value={activeTabId} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
            <Tab label="Thông tin nhà bán" classes={{ root: classes.tab }} />
            <Tab label="Xác thực nhà bán" classes={{ root: classes.tab }} />
          </Tabs>
          <Form onSubmit={onSubmit} subscription={{ submitting: true }}>
            {({ handleSubmit, submitting }) => (
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
                          <MenuItem key="small" value="personal">
                            Cá nhân
                          </MenuItem>
                          <MenuItem key="big" value="company">
                            Công ty / Hộ kinh doanh
                          </MenuItem>
                        </Field>
                      </FormControl>

                      <div className={classes.formButtons}>
                        <Button color="primary" size="large" className={classes.forgetButton}>
                          <Icon>help_outline</Icon> Hỗ trợ
                        </Button>
                        <Button onClick={() => setActiveTabId(1)} variant="contained" size="large" color="secondary">
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
                      <Typography variant="h1" color="primary" className={classes.greeting}>
                        Xin chào !
                      </Typography>
                      <Typography variant="h3" color="primary" className={classes.subGreeting}>
                        Đăng ký thông tin gian hàng
                      </Typography>
                      <div className={classes.fieldRow}>
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
                        name="storeUrl"
                        placeholder="foxiny.vn/cua-hang"
                        type="text"
                        margin="normal"
                      />
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
                          <FormButton variant="contained" size="large" color="secondary">
                            Đăng ký
                          </FormButton>
                        )}
                      </div>
                    </TabContainer>
                  ) : (
                    <Typography />
                  )}
                </SwipeableViews>
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
