import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress, CircularProgress } from '@material-ui/core';

const styles = theme => ({
  root: {
    maxWidth: '935px',
    margin: 'auto',
  },
});

const Loading = ({ circle, classes }) => {
  return (
    <div className={classes.root}>
      {circle ? <CircularProgress color="secondary" /> : <LinearProgress color="secondary" />}
    </div>
  );
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  circle: PropTypes.bool,
};

Loading.defaultProps = {
  circle: false,
};

export default withStyles(styles)(Loading);
