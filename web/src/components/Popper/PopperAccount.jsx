import React from 'react';
import { Popper, Paper, MenuList, MenuItem, Fade, ClickAwayListener } from '@material-ui/core';
import { Link } from 'react-router-dom';

const PopperAccount = ({
  open,
  anchorEl,
  arrowRef,
  classes,
  handleArrowRef,
  handleClose,
  handleAfterLogout,
  userId,
  logout,
}) => (
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
          <span className={classes.arrow} ref={handleArrowRef} />
          <Paper className={classes.paper}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList>
                <MenuItem component={Link} to={`/profile/${userId}`} className={classes.menuItem}>
                  Trang cá nhân
                </MenuItem>
                <MenuItem component={Link} to="/sellers/" className={classes.menuItem}>
                  Quản lý bán hàng
                </MenuItem>
                <MenuItem
                  onClick={event => {
                    handleClose(event);
                    logout().then(({ data }) => {
                      if (data.logout.token) {
                        handleAfterLogout();
                      }
                    });
                  }}
                >
                  Đăng xuất
                </MenuItem>
                <MenuItem
                  onClick={event => {
                    handleClose(event);
                    logout({
                      variables: {
                        all: true,
                      },
                    }).then(({ data }) => {
                      if (data.logout.token) {
                        handleAfterLogout();
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
);

export default PopperAccount;
