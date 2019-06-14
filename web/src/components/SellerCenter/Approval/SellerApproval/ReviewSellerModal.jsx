import React from 'react';
import { Dialog, Slide, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Form } from 'react-final-form';
import { DialogTitle, DialogContent, DialogActions } from '../../../../utils/common/Dialog';
import SellerBusinessInfo from '../../SellerDeclaration/SellerBusinessInfo';
import SetValueFunction from '../../../../utils/context/SetValueFunc';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const ReviewSellerModal = ({ open, handleClose, sellers, ...props }) => {
  const classes = useStyles();

  const onSubmit = values => {};
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle onClose={handleClose}>
        <Typography variant="h6" color="inherit">
          Duyệt thông tin của Nhà bán
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Form
          onSubmit={onSubmit}
          subscription={{ submitting: true, values: true }}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
          }}
        >
          {({
            handleSubmit,
            submitting,
            values,
            form: {
              mutators: { setValue },
            },
          }) => (
            <form onSubmit={handleSubmit} noValidate>
              <SetValueFunction.Provider value={{ setValue }}>
                <div className={classes.container}>
                  <SellerBusinessInfo myRetailers={sellers} review />
                </div>
                <pre>{JSON.stringify(values, 0, 2)}</pre>
              </SetValueFunction.Provider>
            </form>
          )}
        </Form>
      </DialogContent>
      <DialogActions>
        <Button color="primary">Đóng và Lưu</Button>
        <Button variant="contained" color="inherit">
          Từ chối
        </Button>
        <Button variant="contained" color="secondary">
          Duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewSellerModal;
