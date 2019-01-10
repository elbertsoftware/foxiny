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
import SignUpForm from './SignUpForm';

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
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class SignUp extends React.Component {
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

  onSubmit = async values => {
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
                Đăng ký
              </Typography>
              <Tabs variant="fullWidth" value={tabValue} onChange={this.handleChange}>
                <Tab label="Email" />
                <Tab label="Phone" />
              </Tabs>
            </div>
          </React.Fragment>
          <SignUpForm
            onSubmit={this.onSubmit}
            handleChangeIndex={this.handleChangeIndex}
            sent={sent}
            theme={theme}
            tabValue={tabValue}
            classes={classes}
          />
          <Typography variant="body2" align="center">
            {'Chưa có tài khoản? '}
            <Link to="/signin">Đăng nhập</Link>
          </Typography>
        </AppForm>
      </React.Fragment>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRoot,
  withStyles(styles, { withTheme: true }),
)(SignUp);
