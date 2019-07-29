/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import { Icon, ListItemText, ListItemIcon, Paper, ClickAwayListener } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import EnhancedList from '../EnhancedList';

const styles = theme => ({
  container: {
    display: 'flex',
  },
  listItem: {
    width: 300,
    borderRadius: 5,
  },
});

const SubList = ({ name, menuItems, classes, selected, setSelected }) => {
  const [visibility, setDisplay] = useState('hidden');
  let timer;
  const handleOpen = () => {
    clearTimeout(timer);
    setDisplay('visible');
  };
  const handleClose = () => {
    timer = setTimeout(() => {
      setDisplay('hidden');
    }, 100);
  };
  return (
    <React.Fragment>
      <ListItem
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        key={name}
        className={`${classes.listItem} subListItem`}
        button
      >
        <ListItemText>{name}</ListItemText>
        <ListItemIcon>
          <Icon>keyboard_arrow_right</Icon>
        </ListItemIcon>
      </ListItem>
      <ClickAwayListener onClickAway={handleClose}>
        <Paper style={{ position: 'absolute', top: 0, left: 320, visibility, width: 300 }}>
          <div style={{ overflow: 'auto', maxHeight: 400 }}>
            <EnhancedList
              onMouseEnter={handleOpen}
              menuItems={menuItems}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </Paper>
      </ClickAwayListener>
    </React.Fragment>
  );
};

SubList.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.any,
  menuItems: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.any,
};

export default withStyles(styles)(SubList);
