/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import { Icon, ListItemText, ListItemIcon, Paper } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import EnhancedList from './EnhancedList';

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
    }, 200);
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
      <Paper style={{ position: 'absolute', top: 0, left: 320, visibility, width: 300 }}>
        <div style={{ overflow: 'auto', maxHeight: 400 }}>
          <EnhancedList
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            menuItems={menuItems}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </Paper>
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
