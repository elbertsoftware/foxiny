import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { capitalize } from '@material-ui/core/utils/helpers';
import { Icon, InputBase, withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  backgroundLight: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  backgroundDark: {
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    height: 40,
    marginTop: 10,
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
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
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
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

const Search = ({ classes, className, background, ...other }) => {
  return (
    <div className={classNames(classes[`background${capitalize(background)}`], classes.search, className)}>
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
  );
};
Search.propTypes = {
  background: PropTypes.oneOf(['light', 'dark']),
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  margin: PropTypes.bool,
};
Search.defaultProps = {
  background: 'light',
  margin: false,
};
export default withStyles(styles)(Search);
