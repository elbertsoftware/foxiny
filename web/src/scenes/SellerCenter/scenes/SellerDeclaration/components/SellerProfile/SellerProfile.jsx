import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Avatar, Icon, withStyles, ButtonBase, Fade, FormControl, InputLabel, FilledInput } from '@material-ui/core';
import { toast } from 'react-toastify';
import { Form, Field, FormSpy } from 'react-final-form';
import { compose, graphql } from 'react-apollo';
import RFTextField from '../../../../../../components/TextField/RFTextField';
import SelectList from '../../../../../../components/Select/SelectList';
import { countries } from '../../../../../../utils/processData/rawData/callingcodes';
import { formatInternationalPhone } from '../../../../../../utils/processData/validation/validation';
import sellerProfileStyles from '../../styles/sellerProfileStyles';
import FormButton from '../../../../../../components/Button/FormButton';
import { UPDATE_RETAILER, RESEND_RETAILER_CONFIMATION } from '../../../../../../utils/graphql/retailer';
import useInterval from '../../../../../../utils/hooks/useInterval';
import UserAvatarModal from '../../../../../User/scenes/UserUploadAvatar/UserAvatarModal';

const SellerProfileCard = ({ classes, cover, image, retailerInfo, ...props }) => {
  // From graphqh
  const { updateRetailer, resendConfirmation } = props;
  const [isEdited, setIsEdited] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);
  const [initData, setInitData] = useState({
    businessName: retailerInfo.businessName,
    businessEmail: retailerInfo.businessEmail,
    businessPhone: retailerInfo.businessPhone,
    businessAddress: retailerInfo.businessAddress && retailerInfo.businessAddress.city,
    countryCode: 84,
  });
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [isPhoneConfirmed, setIsPhoneConfirmed] = useState(false);
  useInterval(
    () => {
      setSeconds(seconds - 1);
      if (seconds === 0) {
        setSeconds(60);
        setSent(false);
      }
    },
    sent ? 1000 : null,
  );
  const checkEmailPhone = (newSellerEmail, newSellerPhone, countryCode) => {
    // Kiểm tra business email và phone này có trùng vs email || phone mà đã đăng ký normal user trước đó không ?
    // Quy trình: Đăng ký normal user > Đăng ký seller.

    let phoneNumber;
    if (newSellerPhone && countryCode) {
      phoneNumber = formatInternationalPhone(newSellerPhone, countryCode);
    }
    if (newSellerEmail && retailerInfo.businessEmail !== newSellerEmail) {
      setIsEmailConfirmed(true);
    } else {
      setIsEmailConfirmed(false);
    }
    if (phoneNumber && retailerInfo.businessPhone !== phoneNumber) {
      setIsPhoneConfirmed(true);
    } else {
      setIsPhoneConfirmed(false);
    }
  };
  const sendConfirmCode = (newEmail, newPhone, countryCode) => async () => {
    console.log(newEmail, newPhone);
    const phoneNumber = formatInternationalPhone(newPhone, countryCode);
    try {
      let flag;
      if (newEmail && newPhone) {
        flag = await resendConfirmation({
          variables: {
            emailOrPhone: newEmail,
          },
        });
        flag = await resendConfirmation({
          variables: {
            emailOrPhone: phoneNumber,
          },
        });
      } else {
        flag = await resendConfirmation({
          variables: {
            emailOrPhone: newEmail || phoneNumber,
          },
        });
      }
      if (flag) {
        setSent(true);
      }
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
    }
  };
  const onSubmit = async values => {
    const data = {
      businessAddress: {
        city: values.businessAddress,
      },
    };
    if (values.businessName !== retailerInfo.businessName) {
      data.businessName = values.businessName;
    }
    if (isEmailConfirmed) {
      data.businessEmail = values.businessEmail;
      data.emailConfirmCode = values.emailCode;
    }
    if (isPhoneConfirmed) {
      const phoneNumber = formatInternationalPhone(values.businessPhone, values.countryCode);
      data.businessPhone = phoneNumber;
      data.phoneConfirmCode = values.phoneCode;
    }

    console.log(retailerInfo);
    try {
      const result = await updateRetailer({
        variables: {
          retailerId: retailerInfo.id,
          data,
        },
      });
      console.log(result);
      toast.success('Cập nhật thông tin thành công.');
      window.location.reload();
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
    }
  };
  useEffect(() => {
    if (isEmailConfirmed || isPhoneConfirmed) {
      toast.info('Vui lòng nhấn Gửi mã... và điễn mã xác nhận trước khi Lưu.');
    }
  }, [isEmailConfirmed, isPhoneConfirmed]);
  let submittingState;
  return (
    <Card className={classes.cardRoot}>
      <CardMedia className={`${classes.cardMedia} ${isEdited ? classes.avatarDarker : undefined}`} image={cover}>
        <Avatar
          src={
            (retailerInfo.businessAvatar && retailerInfo.businessAvatar.uri) ||
            'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
          }
          className={`${classes.avatarBig} ${classes.avatar} ${isEdited ? classes.avatarDarker : undefined}`}
        />
        {isEdited && (
          <React.Fragment>
            <ButtonBase className={`${classes.buttonBase} ${classes.buttonChangeCover}`}>
              <div className={classes.changeAvaBox}>
                <Icon size="large" className={`${classes.changeCoverIcon} ${classes.changeAvaIcon}`}>
                  panorama
                </Icon>
                <Typography className={`${classes.changeCoverIcon} ${classes.changeAvaIcon}`}>
                  Thay đổi ảnh bìa
                </Typography>
              </div>
            </ButtonBase>
            <ButtonBase onClick={() => setOpen(true)} className={`${classes.buttonBase} ${classes.buttonChangeAva}`}>
              <div className={classes.changeAvaBox}>
                <Icon className={classes.changeAvaIcon}>add_photo_alternate</Icon>
                <Typography className={classes.changeAvaIcon}>Thay đổi</Typography>
              </div>
            </ButtonBase>
          </React.Fragment>
        )}
      </CardMedia>
      <CardContent className={classes.contentRoot}>
        <div className={classes.cardAction}>
          {!isEdited ? (
            <React.Fragment>
              <Button onClick={() => setIsEdited(true)}>
                <Icon>edit</Icon>
                <span>Chỉnh sửa</span>
              </Button>
              <IconButton className={classes.more}>
                <Icon>more_vert</Icon>
              </IconButton>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button className={classes.button} onClick={() => setIsEdited(false)}>
                Cancle
              </Button>
              <FormButton
                disabled={submittingState || ((isEmailConfirmed || isPhoneConfirmed) && !sent)}
                onClick={() =>
                  // external submit
                  // submit for SellerEditForm below
                  // { cancelable: true } required for Firefox
                  // https://github.com/facebook/react/issues/12639#issuecomment-382519193
                  document.getElementById('editForm').dispatchEvent(new Event('submit', { cancelable: true }))
                }
                variant="contained"
                color="secondary"
                className={classes.button}
              >
                Lưu
              </FormButton>
            </React.Fragment>
          )}
        </div>
        {!isEdited ? (
          <React.Fragment>
            <Typography align="left" className={classes.heading}>
              {retailerInfo.businessName}
            </Typography>
            <Typography align="left" variant="subtitle2">
              {retailerInfo.businessEmail}
            </Typography>
            <Typography align="left" variant="subtitle2" className={classes.subheading}>
              {retailerInfo.businessPhone}
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Icon color="secondary">location_on</Icon>
              </Grid>
              <Grid item>
                <Typography gutterBottom>
                  {retailerInfo.businessAddress && retailerInfo.businessAddress.city}
                </Typography>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Form onSubmit={onSubmit} initialValues={initData} subscription={{ submitting: true, values: true }}>
              {({ handleSubmit, submitting, values }) => {
                submittingState = submitting;
                return (
                  <Fade in={isEdited}>
                    <form id="editForm" className={classes.finalForm} onSubmit={handleSubmit} noValidate>
                      {(isEmailConfirmed || isPhoneConfirmed) && (
                        <Button
                          onClick={sendConfirmCode(
                            isEmailConfirmed && values.businessEmail,
                            isPhoneConfirmed && values.businessPhone,
                            values.countryCode,
                          )}
                          className={`${classes.buttonSend} ${classes.button}`}
                        >
                          {sent ? seconds : 'Gửi mã xác nhận cho tôi'}
                        </Button>
                      )}
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Icon className={classes.icon}>account_circle</Icon>
                        </Grid>
                        <Grid className={classes.field} item>
                          <Field
                            fullWidth
                            size="small"
                            component={RFTextField}
                            disabled={submitting}
                            name="businessName"
                            label="Tên cửa hàng"
                            type="text"
                            variant="filled"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        className={isEmailConfirmed ? classes.marginBottom : undefined}
                        spacing={2}
                        alignItems="center"
                      >
                        <Grid item>
                          <Icon className={classes.icon}>email</Icon>
                        </Grid>
                        <Grid className={isEmailConfirmed ? classes.width60 : classes.field} item>
                          <Field
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            name="businessEmail"
                            label="Địa chỉ Email cửa hàng"
                            type="email"
                            variant="outlined"
                          />
                        </Grid>
                        {isEmailConfirmed && (
                          <Grid className={classes.width30} item>
                            <Field
                              fullWidth
                              size="large"
                              component={RFTextField}
                              disabled={submitting}
                              required
                              name="emailCode"
                              label="Nhập mã xác thực email"
                              type="email"
                              variant="outlined"
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Grid className={classes.marginBottom} container spacing={2} alignItems="center">
                        <Grid item>
                          <Icon className={classes.icon}>phone</Icon>
                        </Grid>
                        <Grid className={classes.width30} item>
                          <FormControl
                            className={classes.formControl}
                            variant="filled"
                            fullWidth
                            margin="normal"
                            required
                          >
                            <InputLabel htmlFor="countryCode">Mã quốc gia</InputLabel>
                            <Field
                              component={SelectList}
                              inputVariant={<FilledInput name="countryCode" id="countryCode" />}
                              disabled={submitting}
                              name="countryCode"
                              required
                              size="large"
                            >
                              {countries}
                            </Field>
                          </FormControl>
                        </Grid>
                        <Grid className={isPhoneConfirmed ? classes.width30 : classes.width60} item>
                          <Field
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            name="businessPhone"
                            label="Số điện thoại cửa hàng"
                            type="text"
                            variant="filled"
                          />
                        </Grid>
                        {isPhoneConfirmed && (
                          <Grid className={classes.width30} item>
                            <Field
                              fullWidth
                              size="large"
                              component={RFTextField}
                              disabled={submitting}
                              required
                              name="phoneCode"
                              label="Nhập mã xác thực số điện thoại"
                              type="text"
                              variant="filled"
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Icon className={classes.icon}>location_on</Icon>
                        </Grid>
                        <Grid className={classes.field} item>
                          <Field
                            fullWidth
                            size="large"
                            component={RFTextField}
                            disabled={submitting}
                            name="businessAddress"
                            label="Địa chỉ"
                            type="text"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
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
                  </Fade>
                );
              }}
            </Form>
          </React.Fragment>
        )}
      </CardContent>
      <UserAvatarModal open={open} handleClose={() => setOpen(false)} sellerId={retailerInfo.id} />
    </Card>
  );
};

export default compose(
  graphql(UPDATE_RETAILER, { name: 'updateRetailer' }),
  graphql(RESEND_RETAILER_CONFIMATION, { name: 'resendConfirmation' }),
  withStyles(sellerProfileStyles),
)(SellerProfileCard);
