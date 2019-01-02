import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { Field, Form, FormSpy } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import withRoot from '../../utils/withRoot';
import NavBar from '../NavBar/NavBar';
import AppForm from '../../utils/common/form/AppForm';
import { email, required } from '../../utils/common/form/validation';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import FormFeedback from '../../utils/common/form/FormFeedback';

const styles = theme => ({
  h4: {
    textTransform: 'none',
  },
  form: {
    marginTop: theme.spacing.unit * 6,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
  feedback: {
    marginTop: theme.spacing.unit * 2,
  },
  leftBottom: {
    position: 'absolute',
    left: '24px',
    bottom: '30px',
  },
  rightBottom: {
    position: 'absolute',
    right: '24px',
    bottom: '30px',
  },
});

const focusOnError = createDecorator();

class SignUp extends React.Component {
  state = {
    sent: false,
  };

  validate = values => {
    const messages = {
      email: 'email',
      password: 'mật khẩu',
    };
    const errors = required(['email', 'password'], values, messages);
    if (!errors.email) {
      const emailError = email(values.email, values);
      if (emailError) {
        errors.email = email(values.email, values);
      }
    }

    return errors;
  };

  handleSubmit = () => {};

  render() {
    const { classes } = this.props;
    const { sent } = this.state;

    return (
      <React.Fragment>
        <NavBar />
        <AppForm>
          <React.Fragment>
            <Typography className={classes.h4} variant="h4" gutterBottom marked="center" align="left">
              Đăng nhập
            </Typography>
          </React.Fragment>
          <Form
            onSubmit={this.handleSubmit}
            subscription={{ submitting: true }}
            validate={this.validate}
            decorators={[focusOnError]}
          >
            {({ handleSubmit, values, submitting }) => (
              <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <Field
                  autoComplete="email"
                  autoFocus
                  component={RFTextField}
                  disabled={submitting || sent}
                  fullWidth
                  label="Email/SĐT"
                  margin="normal"
                  name="email"
                  required
                  size="large"
                />
                <Field
                  fullWidth
                  size="large"
                  component={RFTextField}
                  disabled={submitting || sent}
                  required
                  name="password"
                  autoComplete="current-password"
                  label="Mật khẩu"
                  type="password"
                  margin="normal"
                />
                <FormSpy subscription={{ submitError: true }}>
                  {({ submitError }) =>
                    submitError ? (
                      <FormFeedback className={classes.feedback} error>
                        {submitError}
                      </FormFeedback>
                    ) : null
                  }
                </FormSpy>
                <FormButton
                  className={classes.button}
                  disabled={submitting || sent}
                  size="large"
                  color="secondary"
                  fullWidth
                >
                  {submitting || sent ? 'Thực hiện...' : 'Đăng nhập'}
                </FormButton>
                <pre>{JSON.stringify(values, undefined, 2)}</pre>
              </form>
            )}
          </Form>
          <Typography
            className={classes.rightBottom}
            component={linkProps => <Link {...linkProps} to="/" />}
            align="center"
          >
            Quên mật khẩu?
          </Typography>
          <Typography className={classes.leftBottom} variant="body2" align="center">
            {'Chưa có tài khoản? '}
            <Link to="/signup">Đăng ký ngay</Link>
          </Typography>
        </AppForm>
      </React.Fragment>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRoot,
  withStyles(styles),
)(SignUp);
