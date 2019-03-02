import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, Icon, Typography, IconButton } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import UserUploadAvatar from './UserUploadAvatar';

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h5">{children}</Typography>
      {onClose ? (
        <IconButton color="primary" aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <Icon>close</Icon>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class UserAvatarModal extends React.Component {
  onClick = () => {
    this.child.onClickSave();
  };

  render() {
    const { handleClose, open } = this.props;
    return (
      <Dialog maxWidth="lg" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Đổi ảnh đại diện
        </DialogTitle>
        <DialogContent>
          <UserUploadAvatar onRef={ref => (this.child = ref)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClick} color="secondary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default UserAvatarModal;
