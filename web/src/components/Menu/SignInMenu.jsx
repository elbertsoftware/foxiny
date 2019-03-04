import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Popper,
  Paper,
  MenuItem,
  MenuList,
  ClickAwayListener,
  Fade,
  Typography,
  Badge,
  Grid,
  Avatar,
} from '@material-ui/core';
import { Mutation, compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { removeAuthorizationToken } from '../../utils/authentication';
import Loading from '../App/Loading';

const LOGOUT = gql`
  mutation logout($all: Boolean = false) {
    logout(all: $all) {
      token
    }
  }
`;
const GET_USER_INFO = gql`
  query {
    me {
      id
      name
      recoverable
      avatar {
        id
        url
        enabled
      }
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
    marginTop: 5,
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
  button: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    marginBottom: '-16px',
  },
  greeting: {
    color: theme.palette.common.white,
    fontSize: '15px',
    paddingLeft: '10px',
    marginBottom: '-18px',
  },
  avatar: {
    margin: 0,
  },
  badge: {
    margin: 0,
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
    removeAuthorizationToken();
    window.location.href = '/';
  };

  render() {
    const { anchorEl, open, arrowRef } = this.state;
    const { classes, user, loading } = this.props;
    if (loading) return <Loading />;
    const name = user.name.split(' ')[0]; // Get first name
    return (
      <div>
        <Mutation mutation={LOGOUT}>
          {logout => (
            <React.Fragment>
              <Grid container alignItems="center" justify="space-around">
                <Badge color="error" badgeContent={1} className={classes.badge} invisible={user.recoverable}>
                  <Avatar alt="user-avatar" src={user.avatar.url} className={classes.avatar} />
                </Badge>
                <div>
                  <Typography variant="body2" className={classes.greeting}>{`Hi, ${name}`}</Typography>

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
                              <MenuList>
                                <MenuItem component={Link} to={`/profile/${user.id}`} className={classes.menuItem}>
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
                </div>
              </Grid>
            </React.Fragment>
          )}
        </Mutation>
      </div>
    );
  }
}

export default compose(
  graphql(GET_USER_INFO, {
    props: ({ data: { me, loading } }) => ({
      loading,
      user: me,
    }),
  }),
  withStyles(styles),
)(SignInMenu);
