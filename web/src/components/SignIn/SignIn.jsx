/* eslint-disable import/named */
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Typography, Tabs, Tab } from '@material-ui/core';
import { Trans } from '@lingui/macro';
import withRoot from '../../utils/withTheme';
import AppForm from '../../utils/common/form/AppForm';
import SignInForm from '../Form/SignInForm';

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

class SignIn extends React.Component {
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
    const { classes, theme } = this.props;
    const { tabValue } = this.state;

    return (
      <React.Fragment>
        <AppForm>
          <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography className={classes.h4} variant="h4" gutterBottom marked="center" align="left">
                <Trans id="signin">Đăng nhập</Trans>
              </Typography>
              <Tabs variant="fullWidth" value={tabValue} onChange={this.handleChange}>
                <Tab label="Email" />
                <Tab label="Phone" />
              </Tabs>
            </div>
          </React.Fragment>
          <SignInForm
            handleChangeIndex={this.handleChangeIndex}
            theme={theme}
            tabValue={tabValue}
            classes={classes}
            history={this.props.history}
          />
          <Typography
            className={classes.rightBottom}
            component={linkProps => <Link {...linkProps} to="/" />}
            align="center"
          >
            Quên mật khẩu?
          </Typography>
          <Typography className={classes.leftBottom} variant="body2" align="center" component={Link} to="/signup">
            Đăng ký
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
