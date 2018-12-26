import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';

const styles = theme => ({
  title: {
    fontSize: 24,
  },
  toolbar: {
    justifyContent: 'stretch',
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing.unit * 3,
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

function NavBar(props) {
  const { classes } = props;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Typography variant="h6" color="inherit" className={classes.title}>
            {'onepirate'}
          </Typography>
          <div className={classes.right}>
            <Typography color="inherit" variant="h6" className={classes.rightLink}>
              {'Sign In'}
            </Typography>
            <Typography variant="h6" className={classNames(classes.rightLink, classes.linkSecondary)}>
              {'Sign Up'}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
