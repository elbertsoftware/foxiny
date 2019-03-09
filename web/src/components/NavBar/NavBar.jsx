import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { compose } from 'react-apollo';
import SignInMenu from '../Menu/SignInMenu';
import SignUpMenu from '../Menu/SignUpMenu';
import { getAuthorizationToken } from '../../utils/authentication';
import NavLang from './NavLang';
import withAuthenticator from '../../utils/RouteProtector';

const styles = theme => ({
  root: {
    minHeight: '100px',
  },
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
  button: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

class NavBar extends React.Component {
  render() {
    const { classes, handleSetLanguage, userLoggedIn, error } = this.props;
    const token = getAuthorizationToken();
    const user = userLoggedIn();
    return (
      <AppBar position="static" color="primary">
        <Toolbar className={classes.root}>
          <a href="/">
            <img alt="Foxiny Inc - We care your needs" src="/assets/foxiny_logo.png" className={classes.image} />
          </a>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Foxiny
          </Typography>
          {token && user ? <SignInMenu user={user} error={error} /> : <SignUpMenu classes={classes} />}
        </Toolbar>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withAuthenticator,
  withStyles(styles),
)(NavBar);
