import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Popper, Paper, MenuItem, MenuList, ClickAwayListener, Fade } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { removeAuthorizationToken, removeUserInfo } from '../../utils/authentication';

const LOGOUT = gql`
  mutation logout($all: Boolean = false) {
    logout(all: $all) {
      token
    }
  }
`;

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
  typo: {
    textTransform: 'none',
    padding: '6px 8px',
    color: theme.palette.common.white,
  },
});

class SignInMenu extends React.Component {
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

  handleAfterLogout = () => {
    const { handleUnAuth } = this.props;
    removeAuthorizationToken();
    removeUserInfo();
    handleUnAuth();
  };

  render() {
    const { anchorEl, open, arrowRef } = this.state;
    const { classes, userInfo, history } = this.props;
    return (
      <div>
        <Mutation mutation={LOGOUT}>
          {logout => (
            <React.Fragment>
              <Button
                aria-owns={open ? 'fade-popper' : undefined}
                variant="outlined"
                color="secondary"
                onMouseEnter={this.handleOpen}
                onMouseLeave={this.handleClose}
                onClick={this.handleClick}
              >
                Hi,
                {userInfo.name}
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
                          <MenuList>
                            <MenuItem
                              onClick={() => history.push(`/profile/${userInfo.id}`)}
                              className={classes.menuItem}
                            >
                              Trang cá nhân
                            </MenuItem>
                            <MenuItem
                              className={classes.menuItem}
                              onClick={event => {
                                this.handleClose(event);
                                logout().then(({ data }) => {
                                  if (data.logout.token) {
                                    this.handleAfterLogout();
                                  }
                                });
                              }}
                            >
                              Đăng xuất
                            </MenuItem>
                            <MenuItem
                              className={classes.menuItem}
                              onClick={event => {
                                this.handleClose(event);
                                logout({
                                  variables: {
                                    all: true,
                                  },
                                }).then(({ data }) => {
                                  if (data.logout.token) {
                                    this.handleAfterLogout();
                                  }
                                });
                              }}
                            >
                              Đăng xuất tất cả các thiết bị
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </React.Fragment>
                  </Fade>
                )}
              </Popper>
            </React.Fragment>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withStyles(styles)(SignInMenu);
