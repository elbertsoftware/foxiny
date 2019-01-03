/* eslint-disable import/named */
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import createDecorator from 'final-form-focus';
import { Link } from 'react-router-dom';
import { Typography, Tabs, Tab } from '@material-ui/core';
import { validate } from '../../utils/common/form/validation';
import withRoot from '../../utils/withRoot';
import NavBar from '../NavBar/NavBar';
import AppForm from '../../utils/common/form/AppForm';
import SignInForm from './SignInForm';

const styles = theme => ({
  h4: {
    textTransform: 'none',
  },
  form: {
    marginTop: theme.spacing.unit * 4,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
    borderRadius: '25px',
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

class SignIn extends React.Component {
  state = {
    sent: false,
    tabValue: 0,
    locale: '',
  };

  handleChange = (event, tabValue) => {
    this.setState({
      tabValue,
    });
  };

  handleChangeIndex = index => {
    this.setState({
      tabValue: index,
    });
  };

  handleSelectChange = event => {
    this.setState({
      locale: event.target.value,
    });
  };

  handleSubmit = () => {};

  render() {
    const { classes, theme } = this.props;
    const { sent, tabValue } = this.state;

    return (
      <React.Fragment>
        <NavBar />
        <AppForm>
          <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography className={classes.h4} variant="h4" gutterBottom marked="center" align="left">
                Đăng nhập
              </Typography>
              <Tabs variant="fullWidth" value={tabValue} onChange={this.handleChange}>
                <Tab label="Email" />
                <Tab label="Phone" />
              </Tabs>
            </div>
          </React.Fragment>
          <SignInForm
            handleSubmit={this.handleSubmit}
            handleChangeIndex={this.handleChangeIndex}
            sent={sent}
            theme={theme}
            tabValue={tabValue}
            classes={classes}
            validate={validate}
            focusOnError={focusOnError}
          />
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
  withStyles(styles, { withTheme: true }),
)(SignIn);
