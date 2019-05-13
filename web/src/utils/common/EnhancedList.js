/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, withStyles } from '@material-ui/core';
import MuiList from '@material-ui/core/List';
import SubList from './SubList';

const styles = theme => ({
  listItem: {
    minWidth: '10rem',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    borderRadius: 5,
  },
  selected: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
  },
});

const EnhancedList = ({ classes, menuItems, selected, setSelected, ...others }) => {
  const renderMenuItems = () => {
    return menuItems.map(menuItem => {
      if (menuItem.hasOwnProperty('subMenuItems')) {
        return (
          <SubList
            key={menuItem.key}
            caption={menuItem.caption}
            menuItems={menuItem.subMenuItems}
            onClick={menuItem.onClick}
            selected={selected}
            setSelected={setSelected}
          />
        );
      }

      return (
        <ListItem
          classes={{ selected: classes.selected }}
          button
          className={classes.listItem}
          key={menuItem.key}
          onClick={() => {
            setSelected(menuItem.key);
            if (menuItem.onClick) {
              menuItem.onClick();
            }
          }}
          selected={selected === menuItem.key}
        >
          <ListItemText>{menuItem.caption}</ListItemText>
        </ListItem>
      );
    });
  };

  return <MuiList {...others}>{renderMenuItems()}</MuiList>;
};

export default withStyles(styles)(EnhancedList);

EnhancedList.propTypes = {
  menuItems: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.any,
  classes: PropTypes.any,
};
