import React from 'react';
import {
  Popper,
  Paper,
  MenuList,
  MenuItem,
  Fade,
  ClickAwayListener,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import SelectSellerModal from '../NavBar/components/SelectSellerModal/SelectSellerModal';

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
}) => {
  // Open modal to select seller khi chuyen sang page seller
  const [openModal, setOpenModal] = React.useState(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleClick = () => setOpenModal(true);
  return (
    <React.Fragment>
      <SelectSellerModal open={openModal} handleClose={handleCloseModal} />
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
                    <MenuItem
                      component={Link}
                      to={`/profile/${userId}`}
                      className={classes.menuItem}
                    >
                      Trang cá nhân
                    </MenuItem>
                    <MenuItem
                      onClick={handleClick}
                      className={classes.menuItem}
                    >
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
    </React.Fragment>
  );
};

export default PopperAccount;
