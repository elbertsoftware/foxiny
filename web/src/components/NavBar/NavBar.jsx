import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';
import SignInMenu from '../Menu/SignInMenu';
import SignUpMenu from '../Menu/SignUpMenu';
import getCurrentUser from '../../graphql/getCurrentUser';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
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

const NavBar = ({ classes, currentUser }) => {
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <a href="/">
            <img alt="Foxiny Inc - We care your needs" src="/assets/foxiny_logo.png" className={classes.image} />
          </a>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Foxiny
          </Typography>
          {currentUser.token ? <SignInMenu currentUser={currentUser} /> : <SignUpMenu classes={classes} />}
        </Toolbar>
      </AppBar>
    </div>
  );
};

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};

export default compose(
  withStyles(styles),
  graphql(getCurrentUser, {
    props: ({ data: { currentUser } }) => ({
      currentUser,
    }),
  }),
)(NavBar);
