/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LayoutBody from '../LayoutBody/LayoutBody';
import Paper from '../Paper/Paper';

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundImage: 'url(../../../images/appCurvyLines.png)',
    backgroundRepeat: 'no-repeat',
  },
  paper: {
    padding: `${theme.spacing.unit * 8}px ${theme.spacing.unit * 6}px`,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing.unit * 10}px ${theme.spacing.unit * 8}px`,
    },
    position: 'relative',
    borderRadius: '15px',
  },
});

function AppForm(props) {
  const { children, classes } = props;

  return (
    <div className={classes.root}>
      <LayoutBody margin marginBottom width="small">
        <Paper className={classes.paper} square={false}>
          {children}
        </Paper>
      </LayoutBody>
    </div>
  );
}

AppForm.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppForm);
