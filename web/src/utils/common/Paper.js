import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MuiPaper from '@material-ui/core/Paper';
import { capitalize } from '@material-ui/core/utils/helpers';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  backgroundLight: {
    backgroundColor: '#fcfcfc',
  },
  backgroundMain: {
    backgroundColor: theme.palette.secondary.light,
  },
  backgroundDark: {
    backgroundColor: theme.palette.secondary.dark,
  },
  root: {
    maxWidth: 935,
    margin: 'auto',
    marginTop: '15px',
    marginBottom: '10px',
  },
  padding: {
    padding: theme.spacing.unit,
  },
});

function Paper(props) {
  const { background, classes, className, padding, ...other } = props;

  return (
    <MuiPaper
      elevation={2}
      className={classNames(
        classes[`background${capitalize(background)}`],
        {
          [classes.padding]: padding,
        },
        classes.root,
        className,
      )}
      {...other}
    />
  );
}

Paper.propTypes = {
  background: PropTypes.oneOf(['light', 'main', 'dark']),
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  padding: PropTypes.bool,
};

Paper.defaultProps = {
  background: 'main',
  padding: false,
};

export default withStyles(styles)(Paper);
