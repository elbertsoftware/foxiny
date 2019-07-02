/* eslint-disable import/named */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Typography, Tabs, Tab } from '@material-ui/core';
import AppForm from '../../../../components/AppForm/AppForm';
import SignUpForm from './components/SignUpForm';

const styles = theme => ({
  h4: {
    textTransform: 'none',
  },
  form: {
    marginTop: 0,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
    borderRadius: '25px',
  },
});

class SignUp extends React.Component {
  state = {
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

  render() {
    const { classes, theme, sellerCenter, setUserId, history, setActiveTabId } = this.props;
    const { tabValue } = this.state;

    return (
      <React.Fragment>
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
            handleChangeIndex={this.handleChangeIndex}
            theme={theme}
            tabValue={tabValue}
            classes={classes}
            history={history}
            sellerCenter={sellerCenter}
            setUserId={setUserId}
            setActiveTabId={setActiveTabId}
          />
          {!sellerCenter && (
            <Typography variant="body2" align="center">
              {'Đã có tài khoản? '}
              <Link to="/signin">Đăng nhập</Link>
            </Typography>
          )}
        </AppForm>
      </React.Fragment>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SignUp);
