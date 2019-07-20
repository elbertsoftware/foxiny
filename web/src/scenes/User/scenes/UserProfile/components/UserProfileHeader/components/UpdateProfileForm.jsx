/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { ReCaptcha } from 'react-recaptcha-google';
import { withStyles } from '@material-ui/core/styles';
import { compose, graphql } from 'react-apollo';
import { toast } from 'react-toastify';
import {
  ExpansionPanelActions,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Button,
  Icon,
  Grid,
  Divider,
  FormHelperText,
} from '@material-ui/core';
import RFTextField from '../../../../../../../components/TextField/RFTextField';
import {
  formatInternationalPhone,
  captChaVerification,
} from '../../../../../../../utils/processData/validation/validation';
import validate from '../../../../../../../utils/processData/validation/validateUserExpFrm';
import SelectList from '../../../../../../../components/Select/SelectList';
import { countries } from '../../../../../../../utils/processData/rawData/callingcodes';
import FormButton from '../../../../../../../components/Button/FormButton/FormButton';
import { UPDATE_USER, RESEND_CONFIRMATION } from '../../../../../../../utils/graphql/user';
import { removeAuthorizationToken, removeUserInfo } from '../../../../../../../utils/processData/localStorage';
import Loading from '../../../../../../../components/Loading/Loading';

const focusOnError = createDecorator();

let resetForm;

const styles = () => ({
  root: {
    margin: '20px 0px',
  },
  field: {
    marginTop: 0,
    marginBottom: '8px',
  },
  button: {
    marginRight: '10px',
  },
  buttonCon: {
    marginTop: '8px',
  },
  verified: {
    display: 'flex',
    alignItems: 'baseline',
  },
});

class UserExpansionForm extends Component {
  state = {
    expanded: null,
    captchaResponse: '',
    verified: true,
  };

  recaptchaRef = React.createRef();

  handleChange = panel => (event, expanded) => {
    resetForm();
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleClose = () => {
    this.setState({
      expanded: false,
    });
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
  };

  onSubmit = async values => {
    const { captchaResponse } = this.state;
    const { updateUser, history, match, user } = this.props;
    // Checked Captcha or not
    if (values.email) {
      if (values.email === user.email) {
        toast.warn('Địa chỉ email này đã được sử dụng');
        return;
      }
    }
    let phoneNumber;
    if (values.phone) {
      phoneNumber = formatInternationalPhone(values.phone, values.countryCode);
      if (phoneNumber === user.phone) {
        toast.warn('Số điện thoại này đã được sử dụng');
        return;
      }
    }
    if (values.email || values.phone) {
      const capRes = captchaResponse;
      if (capRes.length !== 0) {
        this.recaptchaRef.current.reset();
      } else {
        this.setState({
          verified: false,
        });
        return;
      }

      const result = await captChaVerification(captchaResponse);
      if (!result.data.success) {
        toast.error('Vui lòng xác thực bạn không phải là người máy.');
        return;
      }
    }
    try {
      await updateUser({
        variables: {
          data: {
            name: values.name,
            email: values.email,
            phone: phoneNumber,
            password: values.password,
            currentPassword: values.currentPassword || values.passwordEmail || values.passwordPhone,
          },
        },
      });
      if (values.name) {
        window.location.reload();
      } else if (values.email || phoneNumber) {
        history.push(`/confirm/${match.params.id}`);
      } else if (values.password && values.currentPassword) {
        // In case update password
        removeAuthorizationToken();
        removeUserInfo();
        history.push('/signin');
      }
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Cập nhật không thành công !');
    }
  };

  render() {
    const { classes, user } = this.props;
    const { expanded, verified } = this.state;
    // const verifiedClassname = classNames({
    //   [classes.verified]: !verifiedAccount,
    // });
    return (
      <div className={classes.root}>
        <Form
          onSubmit={this.onSubmit}
          subscription={{ submitting: true }}
          validate={validate(expanded)}
          decorators={[focusOnError]}
          initialValues={{ countryCode: 84 }}
        >
          {({ handleSubmit, submitting, form: { reset } }) => {
            resetForm = reset;
            return (
              <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                  <ExpansionPanelSummary expandIcon={expanded !== 'panel1' && <Icon>edit</Icon>}>
                    <div>
                      <Typography variant="subtitle1">
                        <b>Tên:</b>
                      </Typography>
                      <Typography variant="body2">{user.name}</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container>
                      <Grid item xs={2}>
                        <Typography variant="subtitle1">Tên mới</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Field component={RFTextField} disabled={submitting} name="name" />
                      </Grid>
                      <Grid item xs={4}>
                        <FormButton
                          disabled={submitting}
                          className={classes.button}
                          size="small"
                          variant="contained"
                          color="secondary"
                        >
                          Lưu
                        </FormButton>
                        <Button onClick={this.handleClose}>Huỷ</Button>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                  {expanded === 'panel1' && submitting && <Loading />}
                </ExpansionPanel>

                <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                  <ExpansionPanelSummary
                    expandIcon={
                      user.email
                        ? expanded !== 'panel2' && <Icon>edit</Icon>
                        : expanded !== 'panel2' && <Icon>add_box</Icon>
                    }
                  >
                    <div>
                      <Typography variant="subtitle1">
                        <b>Email:</b>
                      </Typography>
                      <Typography variant="body2">{user.email ? user.email : 'Chưa có thông tin'}</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container direction="column">
                      <Field
                        className={classes.field}
                        component={RFTextField}
                        disabled={submitting}
                        name="email"
                        placeholder="Email mới"
                      />
                      <Field
                        component={RFTextField}
                        disabled={submitting}
                        name="passwordEmail"
                        margin="normal"
                        placeholder="Mật khẩu"
                        type="password"
                      />
                      {expanded === 'panel2' && (
                        <ReCaptcha
                          ref={this.recaptchaRef}
                          size="normal"
                          render="explicit"
                          sitekey="6Lc8fIoUAAAAAEIelPYBBoehOd00PSDckbO75rhh"
                          hl="vi"
                          onloadCallback={this.onLoadRecaptcha}
                          verifyCallback={this.verifyCallback}
                        />
                      )}
                      {expanded === 'panel2' && !verified && (
                        <FormHelperText id="component-error-text" error>
                          Vui lòng xác nhận bạn không phải là người máy
                        </FormHelperText>
                      )}
                    </Grid>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button onClick={this.handleClose}>Huỷ</Button>
                    <FormButton
                      disabled={submitting}
                      className={classes.button}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      Lưu
                    </FormButton>
                  </ExpansionPanelActions>
                  {expanded === 'panel2' && submitting && <Loading />}
                </ExpansionPanel>

                <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                  <ExpansionPanelSummary
                    expandIcon={
                      user.phone
                        ? expanded !== 'panel3' && <Icon>edit</Icon>
                        : expanded !== 'panel3' && <Icon>add_box</Icon>
                    }
                  >
                    <div>
                      <Typography variant="subtitle1">
                        <b>Số điện thoại</b>
                      </Typography>
                      <Typography variant="body2">{user.phone ? user.phone : 'Chưa có thông tin'}</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container direction="column">
                      <Field
                        className={classes.field}
                        component={SelectList}
                        disabled={submitting}
                        name="countryCode"
                        required
                        size="large"
                      >
                        {countries}
                      </Field>
                      <Field
                        component={RFTextField}
                        disabled={submitting}
                        name="phone"
                        margin="normal"
                        placeholder="SĐT mới"
                      />
                      <Field
                        component={RFTextField}
                        disabled={submitting}
                        name="passwordPhone"
                        margin="normal"
                        placeholder="Mật khẩu"
                        type="password"
                      />
                      {expanded === 'panel3' && (
                        <ReCaptcha
                          ref={this.recaptchaRef}
                          size="normal"
                          render="explicit"
                          sitekey="6Lc8fIoUAAAAAEIelPYBBoehOd00PSDckbO75rhh"
                          hl="vi"
                          onloadCallback={this.onLoadRecaptcha}
                          verifyCallback={this.verifyCallback}
                        />
                      )}
                      {expanded === 'panel3' && !verified && (
                        <FormHelperText id="component-error-text" error>
                          Vui lòng xác nhận bạn không phải là người máy
                        </FormHelperText>
                      )}
                    </Grid>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button onClick={this.handleClose}>Huỷ</Button>
                    <FormButton
                      disabled={submitting}
                      className={classes.button}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      Lưu
                    </FormButton>
                  </ExpansionPanelActions>
                  {expanded === 'panel3' && submitting && <Loading />}
                </ExpansionPanel>

                <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
                  <ExpansionPanelSummary expandIcon={expanded !== 'panel4' && <Icon>edit</Icon>}>
                    <div>
                      <Typography variant="subtitle1">
                        <b>Mật khẩu</b>
                      </Typography>
                      <Typography variant="body2">●●●●●●●●</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container direction="column">
                      <Field
                        className={classes.field}
                        component={RFTextField}
                        disabled={submitting}
                        name="currentPassword"
                        placeholder="Mật khẩu hiện tại"
                        type="password"
                      />
                      <Field
                        component={RFTextField}
                        disabled={submitting}
                        margin="normal"
                        name="password"
                        placeholder="Mật khẩu mới"
                        type="password"
                      />
                      <Field
                        component={RFTextField}
                        disabled={submitting}
                        margin="normal"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        type="password"
                      />
                    </Grid>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button onClick={this.handleClose}>Huỷ</Button>
                    <FormButton
                      disabled={submitting}
                      className={classes.button}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      Lưu
                    </FormButton>
                  </ExpansionPanelActions>
                  {expanded === 'panel4' && submitting && <Loading />}
                </ExpansionPanel>
              </form>
            );
          }}
        </Form>
      </div>
    );
  }
}
export default compose(
  graphql(UPDATE_USER, { name: 'updateUser' }),
  graphql(RESEND_CONFIRMATION, { name: 'resendConfirmation' }),
  withStyles(styles),
)(UserExpansionForm);
