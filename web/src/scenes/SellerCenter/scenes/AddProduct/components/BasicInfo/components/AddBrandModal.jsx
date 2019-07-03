import React from 'react';
import { Field } from 'react-final-form';
import { Dialog, FormLabel, TextField, Button } from '@material-ui/core';
import { DialogTitle, DialogContent, DialogActions } from '../../../../../../../components/Dialog/Dialog';

const AddBrandModal = ({ classes, openModal, handleCloseModal }) => {
  return (
    <Dialog open={openModal} maxWidth="md" onClose={handleCloseModal}>
      <DialogTitle>Thêm thương hiệu của bạn</DialogTitle>
      <DialogContent>
        <FormLabel>Tên thương hiệu</FormLabel>
        <Field fullWidth component={TextField} margin="normal" name="brandName" type="text" variant="outlined" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} variant="text">
          Đóng
        </Button>
        <Button variant="contained" color="secondary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBrandModal;
