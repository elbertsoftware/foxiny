import React from 'react';
import { Popper, Paper, List, ListItem, ListItemText, Fade, ClickAwayListener } from '@material-ui/core';
import { Link } from 'react-router-dom';

const PopperNotification = ({ openNoti, anchorElNoti, arrowRefNoti, classes, handleArrowRefNoti, handleCloseNoti }) => (
  <Popper
    id="fade-popper-noti"
    open={openNoti}
    anchorEl={anchorElNoti}
    placement="bottom"
    className={classes.popperNoti}
    modifiers={{
      flip: {
        enabled: true,
      },
      arrow: {
        enabled: true,
        element: arrowRefNoti,
      },
    }}
    transition
  >
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={200}>
        <React.Fragment>
          <span className={classes.arrow} ref={handleArrowRefNoti} />
          <Paper className={classes.paperNoti}>
            <ClickAwayListener onClickAway={handleCloseNoti}>
              <List>
                <ListItem button component={Link} to="/security-question">
                  <ListItemText
                    primary="Bảo mật"
                    secondary="Trả lời câu hỏi bảo mật sẽ giúp bạn dễ dàng lấy lại mật khẩu khi cần."
                  />
                </ListItem>
              </List>
            </ClickAwayListener>
          </Paper>
        </React.Fragment>
      </Fade>
    )}
  </Popper>
);

export default PopperNotification;
