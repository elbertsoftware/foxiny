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
import RFTextField from '../../utils/common/form/RFTextField';
import {
  email,
  phone,
  required,
  formatInternationalPhone,
  confirm,
  captChaVerification,
} from '../../utils/common/form/validation';
import UpdateEmailFields from './Fields/UpdateEmailFields';
import UpdatePhoneFields from './Fields/UpdatePhoneFields';
import UpdatePasswordFields from './Fields/UpdatePasswordFields';
import FormButton from '../../utils/common/form/FormButton';
import UPDATE_USER from '../../graphql/updateUser';

const focusOnError = createDecorator();

const styles = theme => ({
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
});

class UserExpansionForm extends Component {
  state = {
    expanded: null,
    captchaResponse: '',
    verified: true,
  };

  recaptchaRef = React.createRef();

  _initData;

  componentDidMount() {
    const { user } = this.props;
    this._initData = {
      name: user.name,
      countryCode: 84,
    };
  }

  handleChange = panel => (event, expanded) => {
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
    const { updateUser } = this.props;
    // Checked Captcha or not
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
        toast.error('Cập nhật không thành công !');
        return;
      }
    }
    let phoneNumber;
    if (values.phone) {
      phoneNumber = formatInternationalPhone(values.phone, values.countryCode);
    }

    try {
      const data = await updateUser({
        variables: {
          data: {
            name: values.name,
            email: values.email,
            phone: phoneNumber,
            password: values.password,
            currentPassword: values.currentPassword,
          },
        },
      });
      console.log(data);
      window.location.reload();
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Cập nhật không thành công !');
    }
  };

  render() {
    const { classes, user } = this.props;
    const { expanded, verified } = this.state;
    return (
      <div className={classes.root}>
        <Form
          onSubmit={this.onSubmit}
          subscription={{ submitting: true }}
          validate={values => {
            let errors = {};
            if (expanded === 'panel2') {
              errors = required(['passwordEmail'], values);
            } else if (expanded === 'panel3') {
              errors = required(['passwordPhone'], values);
            } else if (expanded === 'panel4') {
              errors = required(['password', 'currentPassword'], values);
            }
            if (!errors.confirmPassword) {
              const confirmError = confirm(values.password, values.confirmPassword);
              if (confirmError) {
                errors.confirmPassword = confirmError;
              }
            }
            if (values.email) {
              const emailError = email(values.email, values);
              if (emailError) {
                errors.email = emailError;
              }
            }
            if (values.phone) {
              const phoneError = phone(values.countryCode, values.phone);
              if (phoneError) {
                errors.phone = phoneError;
              }
            }
            return errors;
          }}
          decorators={[focusOnError]}
          initialValues={this._initData}
        >
          {({ handleSubmit, values, submitting }) => {
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
                      <Typography variant="body2">{user.email || 'Chưa có thông tin.'}</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container direction="column">
                      <UpdateEmailFields classes={classes} />
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
                      <Typography variant="body2">{user.phone || 'Chưa có thông tin.'}</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container direction="column">
                      <UpdatePhoneFields classes={classes} />
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
                      <UpdatePasswordFields classes={classes} />
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
  withStyles(styles),
)(UserExpansionForm);
