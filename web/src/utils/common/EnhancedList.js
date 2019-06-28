/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, withStyles } from '@material-ui/core';
import MuiList from '@material-ui/core/List';
import SubList from './SubList';
import { capitalizeFirstLetter } from '../utilForManipulateString';

const styles = theme => ({
  listItem: {
    minWidth: '10rem',
    borderRadius: 5,
  },
});

const EnhancedList = ({ classes, menuItems, selected, setSelected, ...others }) => {
  const renderMenuItems = () => {
    return menuItems.map(menuItem => {
      if (menuItem.hasOwnProperty('subMenuItems')) {
        return (
          <SubList
            key={menuItem.id}
            name={capitalizeFirstLetter(menuItem.name)}
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
          key={menuItem.id}
          onClick={() => {
            setSelected(menuItem.id);
            if (menuItem.onClick) {
              menuItem.onClick();
            }
          }}
          selected={selected === menuItem.id}
        >
          <ListItemText>{capitalizeFirstLetter(menuItem.name)}</ListItemText>
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
