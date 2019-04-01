import React from 'react';
import { Button, Dialog } from '@material-ui/core';
import { DialogTitle, DialogContent, DialogActions } from '../../../utils/common/Dialog';

import UserUploadAvatar from './UserUploadAvatar';

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
