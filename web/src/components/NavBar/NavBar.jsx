import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Toolbar, Button, IconButton, Icon, InputBase } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';
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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    height: 40,
    marginTop: 10,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 250,
      },
    },
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
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Icon>search</Icon>
          </div>
          <InputBase
            placeholder="Tìm kiếm…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
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
