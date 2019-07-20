/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Form, Field } from 'react-final-form';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { toast } from 'react-toastify';
import RFTextField from '../../../../components/TextField/RFTextField';
import FormButton from '../../../../components/Button/FormButton/FormButton';
import AppForm from '../../../../components/AppForm/AppForm';
import { required } from '../../../../utils/processData/validation/validation';
import { CONFIRM_USER, RESEND_CONFIRMATION } from '../../../../utils/graphql/user';

let count = 59;

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: '24px',
    right: '30px',
  },
  wrapper: {
    margin: theme.spacing.unit,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    marginRight: '5px',
  },
});

class ConfirmPage extends React.Component {
  state = {
    loading: false,
    success: false,
    seconds: 60,
    sent: false,
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearTimeout(this.timer);
    clearTimeout(this.timerReturn);
  }

  onSubmit = async values => {
    if (!this.state.loading) {
      if (this._isMounted) {
        this.setState(
          {
            success: false,
            loading: true,
          },
          () => {
            this.timer = setTimeout(() => {
              this.props
                .confirmUser({
                  variables: {
                    data: {
                      userId: this.props.match ? this.props.match.params.id : this.props.userId,
                      code: values.confirmCode,
                    },
                  },
                })
                .then(({ data }) => {
                  if (data.confirmUser) {
                    toast.success('Xác thực thành công !');
                    this.setState(
                      {
                        success: true,
                        loading: false,
                      },
                      () => {
                        this.timerReturn = setTimeout(() => {
                          if (this.props.userId) {
                            this.props.history.push('/sellers/sign');
                            window.location.reload();
                          } else {
                            window.location.href = '/';
                          }
                        }, 50);
                      },
                    );
                  }
                })
                .catch(error => {
                  toast.error('Xác thực thất bại. Vui lòng thử lại.');
                  toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi khi đăng nhập !');
                  this.setState({
                    loading: false,
                  });
                });
            }, 1000);
          },
        );
      }
    }
  };

  intervalHandle;

  startCountDown = () => {
    this.setState({
      sent: true,
    });
    this.intervalHandle = setInterval(() => {
      this.setState({ seconds: count-- });
      if (this.state.seconds === 0) {
        clearInterval(this.intervalHandle);
        this.setState({
          sent: false,
          seconds: 60,
        });
        count = 59;
      }
    }, 1000);
  };

  handleResend = async () => {
    await this.startCountDown();
    // Resend code
    this.props
      .resendConfirmation({
        variables: {
          userId: this.props.match.params.id,
        },
      })
      .then(({ data }) => {
        console.log(data.resendConfirmation.id);
      })
      .catch(error => toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !'));
  };

  render() {
    const { loading, success, sent, seconds } = this.state;
    const { classes } = this.props;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    return (
      <AppForm>
        <React.Fragment>
          <Typography variant="h4">Xác thực tài khoản</Typography>
          <Typography variant="h5">Vui lòng nhập mã xác thực được gửi đến email hoặc số điện thoại của bạn</Typography>
          <Form
            onSubmit={this.onSubmit}
            subscription={{ submitting: true }}
            validate={values => {
              let errors = {};
              errors = required(['confirmCode'], values);
              return errors;
            }}
          >
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Field
                  component={RFTextField}
                  margin="normal"
                  label="Mã xác thực"
                  name="confirmCode"
                  type="text"
                  fullWidth
                />
                <div className={classes.root}>
                  <FormButton variant="contained" color="secondary" className={buttonClassname} disabled={loading}>
                    {loading && <CircularProgress size={18} className={classes.buttonProgress} />}
                    {submitting ? 'Thực hiện...' : 'Xác thực'}
                  </FormButton>
                  <Button onClick={this.handleResend} color="primary" disabled={sent}>
                    {!sent ? 'Gửi lại' : seconds}
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </React.Fragment>
      </AppForm>
    );
  }
}
export default compose(
  graphql(CONFIRM_USER, { name: 'confirmUser' }),
  graphql(RESEND_CONFIRMATION, { name: 'resendConfirmation' }),
  withStyles(styles),
)(ConfirmPage);
