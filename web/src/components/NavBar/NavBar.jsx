import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import SignInMenu from '../Menu/SignInMenu';
import SignUpMenu from '../Menu/SignUpMenu';
import { getAuthorizationToken, getUserInfo } from '../../utils/authentication';

const styles = theme => ({
  root: {},
  grow: {
    flexGrow: 1,
    textTransform: 'uppercase',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  image: {
    maxWidth: '60px',
    height: 'auto',
  },
  signUpMenu: {
    display: 'flex',
  },
});

class NavBar extends React.Component {
  state = {
    auth: false,
  };

  componentDidMount() {
    if (getAuthorizationToken()) {
      this.setState({ auth: true });
    }
  }

  handleUnAuth = () => {
    this.setState({ auth: false });
  };

  render() {
    const { classes, history } = this.props;
    const { auth } = this.state;
    const userInfo = getUserInfo();

    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <a href="/">
            <img alt="Foxiny Inc - We care your needs" src="/assets/foxiny_logo.png" className={classes.image} />
          </a>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Foxiny
          </Typography>
          {auth ? (
            <SignInMenu history={history} userInfo={userInfo} handleUnAuth={this.handleUnAuth} />
          ) : (
            <SignUpMenu classes={classes} />
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
