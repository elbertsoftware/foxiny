import React, { useState } from 'react';
import PropsType from 'prop-types';
import { Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import RichTextEditor from 'react-rte';
import { Typography, Paper, withStyles, Grid, Button, FormLabel } from '@material-ui/core';
import AddBrandModal from './AddBrandModal';
import ApprovalContainer from '../../../../utils/ApprovalContainer';

const styles = theme => ({
  paper: {
    marginBottom: 16,
  },
  category: {
    display: 'flex',
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    marginLeft: 16,
  },
  createNew: {
    display: 'flex',
  },
  btnCreate: {
    height: '80%',
    margin: '1.65rem 0',
    width: 90,
  },
  textField: {
    marginTop: 44,
  },
  textEditorContainer: {
    marginTop: 12,
  },
  detailInfo: {
    marginLeft: 16,
  },
  richTextEditor: {
    marginTop: 8,
    minHeight: 300,
  },
});

const BasicInfo = ({ classes, onChange, review, ...props }) => {
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onChangeValue = value => {
    setValue(value);
    if (onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      onChange(value.toString('html'));
    }
  };
  return (
    <Paper square elevation={0} className={classes.paper}>
      <Paper className={classes.category}>
        <Typography>Danh mục:</Typography>
        <Typography variant="subtitle1" className={classes.categoryName}>
          Bàn gỗ
        </Typography>
      </Paper>
      <Grid container spacing={16}>
        <Grid item xs>
          <ApprovalContainer review={review} name="checkProductName">
            <Field
              fullWidth
              component={TextField}
              required
              margin="normal"
              label="Tên sản phẩm"
              name="name"
              type="text"
              variant="outlined"
            />
          </ApprovalContainer>
        </Grid>
        <Grid item xs>
          <ApprovalContainer review={review} name="checkBrandname">
            <div className={classes.createNew}>
              <Field
                fullWidth
                component={TextField}
                required
                margin="normal"
                label="Thương hiệu"
                name="brandName"
                type="text"
                variant="outlined"
                helperText="Không tìm thấy thương hiệu phù hợp? Vui lòng nhấn vào nút Tạo mới"
              />

              <Button onClick={handleOpen} className={classes.btnCreate} variant="text" color="secondary">
                Tạo mới
              </Button>
              <AddBrandModal openModal={open} handleCloseModal={handleClose} />
            </div>
          </ApprovalContainer>
        </Grid>
      </Grid>
      <Grid container spacing={16}>
        <Grid item xs>
          <ApprovalContainer review={review} name="checkFromWhere">
            <Field
              fullWidth
              component={TextField}
              margin="normal"
              label="Xuất xứ thương hiệu"
              name="fromWhere"
              type="text"
              variant="outlined"
            />
          </ApprovalContainer>
        </Grid>
        <Grid item xs />
      </Grid>
      <ApprovalContainer review={review} name="checkDescription">
        <Field
          className={classes.textField}
          component={TextField}
          multiline
          fullWidth
          rows="4"
          margin="normal"
          label="Đặc điểm nổi bật"
          name="briefDescription"
          type="text"
          variant="outlined"
          helperText="Tối thiểu 3 ý, mỗi ý 1 dòng"
        />
      </ApprovalContainer>
      <ApprovalContainer review={review} name="checkDetailDescription">
        <div className={classes.textEditorContainer}>
          <FormLabel className={classes.detailInfo}>Mô tả chi tiết sản phẩm *</FormLabel>
          <RichTextEditor className={classes.richTextEditor} value={value} onChange={onChangeValue} />
        </div>
      </ApprovalContainer>
    </Paper>
  );
};

BasicInfo.propType = {
  review: PropsType.bool,
};
BasicInfo.defaultProps = {
  review: false,
};
export default withStyles(styles)(BasicInfo);
