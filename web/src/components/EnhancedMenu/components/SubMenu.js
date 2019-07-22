/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { Icon } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import EnhancedMenu from './EnhancedMenu';

const styles = {
  subMenuItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

class SubMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      anchorElement: null,
    };
  }

  handleItemClick = event => {
    if (!this.anchorElement) {
      this.setState({
        anchorElement: event.currentTarget,
      });
    }

    this.setState({
      menuOpen: !this.menuOpen,
    });
  };

  handleSubMenuClose = () => {
    this.setState({
      menuOpen: false,
    });
  };

  render() {
    const { caption, menuItems, classes } = this.props;
    const { anchorElement, menuOpen } = this.state;
    return (
      <React.Fragment>
        <MenuItem onClick={this.handleItemClick} className={classNames(classes.subMenuItem)}>
          {caption}
          <Icon>keyboard_arrow_right</Icon>
        </MenuItem>
        <EnhancedMenu
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={menuOpen}
          menuItems={menuItems}
          anchorElement={anchorElement}
          onClose={this.handleSubMenuClose}
        />
      </React.Fragment>
    );
  }
}

SubMenu.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.any,
  menuItems: PropTypes.array.isRequired,
};

export default withStyles(styles)(SubMenu);
