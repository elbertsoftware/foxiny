/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Tooltip, IconButton, Icon, withStyles, Toolbar, Typography } from '@material-ui/core';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 50%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const EnhancedTableToolbar = props => {
  const { numSelected, classes, title, deleteRow, button } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} được chọn
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={deleteRow} aria-label="Delete">
              <Icon>delete</Icon>
            </IconButton>
          </Tooltip>
        ) : (
          <React.Fragment>{button && button}</React.Fragment>
        )}
      </div>
    </Toolbar>
  );
};
EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string,
  button: PropTypes.node,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
