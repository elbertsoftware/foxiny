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
    padding: `${theme.spacing(8)}px ${theme.spacing(6)}px`,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(10)}px ${theme.spacing(8)}px`,
    },
    position: 'relative',
    borderRadius: '15px',
  },
});

function AppForm(props) {
  const { children, classes, width, square } = props;

  return (
    <div className={classes.root}>
      <LayoutBody margin marginBottom width={width}>
        <Paper className={classes.paper} square={square}>
          {children}
        </Paper>
      </LayoutBody>
    </div>
  );
}

AppForm.propTypes = {
  square: PropTypes.bool,
  width: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full']),
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};

AppForm.defaultProps = {
  square: false,
  width: 'small',
};

export default withStyles(styles)(AppForm);
