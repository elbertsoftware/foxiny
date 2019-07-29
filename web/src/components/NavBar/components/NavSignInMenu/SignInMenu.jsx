import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Badge,
  Grid,
  Avatar,
  IconButton
} from "@material-ui/core";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import {
  removeAuthorizationToken,
  removeSellerId,
  removeProductIds
} from "../../../../utils/processData/localStorage";
import PopperAccount from "../../../Popper/PopperAccount";
import PopperNotification from "../../../Popper/PopperNotification";
import { LOGOUT } from "../../../../utils/graphql/user";

const styles = theme => ({
  popper: {
    zIndex: 1,
    marginTop: 5,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${
          theme.palette.common.white
        } transparent`
      }
    }
  },
  popperNoti: {
    zIndex: 1,
    marginTop: 17,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${
          theme.palette.common.white
        } transparent`
      }
    }
  },
  arrow: {
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  },
  paper: {
    maxWidth: 400
  },
  paperNoti: {
    maxWidth: 400
  },
  typo: {
    textTransform: "none",
    padding: "6px 8px",
    color: theme.palette.common.white
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent"
    },
    marginBottom: "-16px"
  },
  greeting: {
    color: theme.palette.common.white,
    fontSize: "15px",
    paddingLeft: "10px",
    marginBottom: "-18px"
  },
  avatar: {
    margin: 0
  },
  badge: {
    margin: 0
  },
  iconButton: {
    padding: 0,
    opacity: 0.75,
    transition: "opacity .5s ease-in-out",
    "&:hover": {
      opacity: 1
    }
  }
});

class SignInMenu extends React.Component {
  state = {
    open: false,
    openNoti: false,
    anchorEl: null,
    arrowRef: null,
    anchorElNoti: null,
    arrowRefNoti: null,
    invisible: true,
    userExpired: false
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({ invisible: user.recoverable, userExpired: user.error });
  }

  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };

  handleClickNoti = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorElNoti: currentTarget,
      openNoti: !state.openNoti
    }));
  };

  handleOpen = event => {
    const { currentTarget } = event;
    this.setState({
      anchorEl: currentTarget,
      open: true
    });
  };

  handleOpenNoti = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorElNoti: currentTarget,
      openNoti: !state.openNoti,
      invisible: !state.invisible
    }));
  };

  handleClose = event => {
    const { anchorEl } = this.state;
    if (anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ anchorEl: null, open: false });
  };

  handleCloseNoti = event => {
    const { anchorElNoti } = this.state;
    if (anchorElNoti.contains(event.target)) {
      return;
    }
    this.setState(state => ({
      anchorElNoti: null,
      openNoti: false,
      invisible: !state.invisible
    }));
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  handleArrowRefNoti = node => {
    this.setState({
      arrowRefNoti: node
    });
  };

  handleAfterLogout = () => {
    removeAuthorizationToken();
    removeSellerId();
    removeProductIds();
    window.location.href = "/";
  };

  render() {
    const {
      anchorEl,
      open,
      arrowRef,
      openNoti,
      anchorElNoti,
      arrowRefNoti,
      invisible,
      userExpired
    } = this.state;
    const { classes, user } = this.props;
    if (userExpired) return <Redirect to="/signin" />;
    return (
      <div>
        <Mutation mutation={LOGOUT}>
          {logout => (
            <Grid container alignItems="center" justify="space-around">
              <Badge
                color="error"
                badgeContent={1}
                className={classes.badge}
                invisible={invisible}
              >
                <IconButton
                  onClick={user.recoverable ? () => {} : this.handleOpenNoti}
                  className={classes.iconButton}
                >
                  <Avatar
                    alt="user-avatar"
                    src={user.profileMedia.uri}
                    className={classes.avatar}
                  />
                </IconButton>
              </Badge>

              <div>
                <Typography variant="body2" className={classes.greeting}>
                  {`Hi, ${user.name.split(" ")[0]}`}
                </Typography>

                <Button
                  className={classes.button}
                  aria-owns={open ? "fade-popper" : undefined}
                  variant="text"
                  color="secondary"
                  onMouseEnter={this.handleOpen}
                  onMouseLeave={this.handleClose}
                  onClick={this.handleClick}
                >
                  Tài khoản
                </Button>
                <PopperNotification
                  openNoti={openNoti}
                  anchorElNoti={anchorElNoti}
                  arrowRefNoti={arrowRefNoti}
                  classes={classes}
                  handleArrowRefNoti={this.handleArrowRefNoti}
                  handleCloseNoti={this.handleCloseNoti}
                />
                <PopperAccount
                  open={open}
                  anchorEl={anchorEl}
                  arrowRef={arrowRef}
                  classes={classes}
                  handleArrowRef={this.handleArrowRef}
                  handleClose={this.handleClose}
                  handleAfterLogout={this.handleAfterLogout}
                  userId={user.id}
                  logout={logout}
                />
              </div>
            </Grid>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withStyles(styles)(SignInMenu);
