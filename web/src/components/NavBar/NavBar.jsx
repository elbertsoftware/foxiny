import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Toolbar, Button, IconButton, Icon, InputBase } from '@material-ui/core';

import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import SignInMenu from '../Menu/SignInMenu';
import SignUpMenu from '../Menu/SignUpMenu';
import { getAuthorizationToken } from '../../utils/authentication';
import NavLang from './NavLang';
import withAuthenticator from '../../utils/RouteProtector';
import Search from '../../utils/common/Search';

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
});

const NavBar = ({ classes, handleSetLanguage, userLoggedIn, error }) => {
  const token = getAuthorizationToken();
  const user = userLoggedIn();
  return (
    <Toolbar className={classes.root}>
      <a href="/">
        <img alt="Foxiny Inc - We care your needs" src="/assets/foxiny_logo.png" className={classes.image} />
      </a>
      <Typography variant="h6" color="inherit" className={classes.grow}>
        Foxiny
      </Typography>
      <div className={classes.signUpMenu}>
        <Search />
        <Button className={classes.button} size="large" component={Link} to="/signin" color="inherit">
          Sản phẩm
        </Button>
        <Button className={classes.button} size="large" component={Link} to="/signin" color="inherit">
          Giới thiệu
        </Button>
        {token && user ? <SignInMenu user={user} error={error} /> : <SignUpMenu classes={classes} />}
        <IconButton color="secondary">
          <Icon fontSize="large">add_shopping_cart</Icon>
        </IconButton>
      </div>
    </Toolbar>
  );
};

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withAuthenticator,
  withStyles(styles),
)(NavBar);
