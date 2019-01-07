/* eslint-disable import/named */
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Typography, Tabs, Tab } from '@material-ui/core';
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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class SignIn extends React.Component {
  state = {
    sent: false,
    tabValue: 0,
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

  handleSubmitEmail = async values => {
    await sleep(500);
    window.alert(JSON.stringify(values, undefined, 2));
  };

  handleSubmitPhone = async values => {
    await sleep(500);
    window.alert(JSON.stringify(values, undefined, 2));
  };

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
            handleSubmitEmail={this.handleSubmitEmail}
            handleSubmitPhone={this.handleSubmitPhone}
            handleChangeIndex={this.handleChangeIndex}
            sent={sent}
            theme={theme}
            tabValue={tabValue}
            classes={classes}
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
