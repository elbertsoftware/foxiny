import React, { Component } from 'react';
import { Button, Popper, Paper, ClickAwayListener, Fade, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.common.white} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
      },
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  paper: {
    maxWidth: 400,
  },
});

class NavLang extends Component {
  state = {
    open: false,
    anchorEl: null,
    arrowRef: null,
  };

  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open,
    }));
  };

  handleOpen = event => {
    const { currentTarget } = event;
    this.setState({
      anchorEl: currentTarget,
      open: true,
    });
  };

  handleClose = event => {
    const { anchorEl } = this.state;
    if (anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ anchorEl: null, open: false });
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };

  render() {
    const { classes, handleSetLanguage } = this.props;
    const { open, arrowRef, anchorEl } = this.state;
    return (
      <React.Fragment>
        <Button
          className={classes.button}
          aria-owns={open ? 'fade-popper' : undefined}
          variant="text"
          color="secondary"
          onMouseEnter={this.handleOpen}
          onMouseLeave={this.handleClose}
          onClick={this.handleClick}
        >
          Tài khoản
        </Button>
        <Popper
          id="fade-popper"
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          className={classes.popper}
          modifiers={{
            flip: {
              enabled: true,
            },
            arrow: {
              enabled: true,
              element: arrowRef,
            },
          }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <React.Fragment>
                <span className={classes.arrow} ref={this.handleArrowRef} />
                <Paper className={classes.paper}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <RadioGroup>
                      <FormControlLabel className={classes.menuItem}>Trang cá nhân</FormControlLabel>
                      <FormControlLabel className={classes.menuItem}>Đăng xuất</FormControlLabel>
                      <FormControlLabel className={classes.menuItem}>Đăng xuất tất cả các thiết bị</FormControlLabel>
                    </RadioGroup>
                  </ClickAwayListener>
                </Paper>
              </React.Fragment>
            </Fade>
          )}
        </Popper>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(NavLang);
