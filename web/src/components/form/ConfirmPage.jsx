/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Form, Field } from 'react-final-form';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import AppForm from '../../utils/common/form/AppForm';
import { required, messages } from '../../utils/common/form/validation';

const CONFIRM_USER = gql`
  mutation confirmUser($data: ConfirmUserInput!) {
    confirmUser(data: $data) {
      enabled
    }
  }
`;

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
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timerReturn);
  }

  onSubmit = ({ confirmUser }) => async values => {
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true,
        },
        () => {
          this.timer = setTimeout(() => {
            confirmUser({
              variables: {
                data: {
                  userId: this.props.match.params.id,
                  code: values.confirmCode,
                },
              },
            }).then(({ data }) => {
              if (data.confirmUser.enabled) {
                this.setState(
                  {
                    success: true,
                    loading: false,
                  },
                  () => {
                    this.timerReturn = setTimeout(() => {
                      this.props.history.push('/');
                    }, 500);
                  },
                );
              }
            });
          }, 1000);
        },
      );
    }
  };

  render() {
    const { loading, success } = this.state;
    const { classes } = this.props;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });
    return (
      <AppForm>
        <Mutation mutation={CONFIRM_USER}>
          {confirmUser => (
            <React.Fragment>
              <Typography variant="h4">Xác thực tài khoản</Typography>
              <Typography variant="h5">
                Vui lòng nhập mã xác thực được gửi đến email hoặc số điện thoại của bạn
              </Typography>
              <Form
                onSubmit={this.onSubmit({ confirmUser })}
                subscription={{ submitting: true }}
                validate={values => {
                  let errors = {};
                  errors = required(['confirmCode'], values, messages);
                  return errors;
                }}
              >
                {({ handleSubmit, submitting }) => (
                  <form onSubmit={handleSubmit} noValidate>
                    <Field
                      autoFocus
                      component={RFTextField}
                      margin="normal"
                      label="Mã xác thực"
                      name="confirmCode"
                      type="text"
                      fullWidth
                    />
                    <div className={classes.root}>
                      <FormButton variant="contained" color="primary" className={buttonClassname} disabled={loading}>
                        {loading && <CircularProgress size={18} className={classes.buttonProgress} />}
                        {submitting ? 'Thực hiện...' : 'Xác thực'}
                      </FormButton>
                      <Button onClick={this.props.history.goBack} color="primary">
                        Quay về
                      </Button>
                    </div>
                  </form>
                )}
              </Form>
            </React.Fragment>
          )}
        </Mutation>
      </AppForm>
    );
  }
}
export default withStyles(styles)(ConfirmPage);
