/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { FieldArray } from 'react-final-form-arrays';
import {
  Button,
  Dialog,
  withStyles,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  IconButton,
  Icon,
  Tooltip,
} from '@material-ui/core';
import { DialogTitle, DialogContent } from '../../../../../../components/Dialog/Dialog';

const styles = () => ({
  actions: {
    display: 'flex',
    padding: 10,
    marginBottom: 10,
    minHeight: '3.5rem',
  },
  btnSave: {
    margin: '0 16px',
  },
  cell: {
    width: '60%',
  },
  widthField: {
    transition: 'all 1s ease-in-out',
    width: '80%',
  },
  addIcon: {
    marginTop: -2.5,
    marginLeft: 2,
  },
  flex: {
    display: 'flex',
  },
  removeButton: {
    marginBottom: 16,
  },
  swapButton: {
    padding: 0,
    marginRight: 28,
  },
});

const AddSelectionModal = ({ classes, openModal, handleCloseModal, save, push, pop, setValue, options }) => {
  const [currentIndex, setIndex] = useState(0);
  const addOption = () => {
    push('options', { listItems: [] });
  };
  const addVariant = () => {
    push(`options[${currentIndex}].listItems`, undefined);
  };
  const handleEnter = event => {
    if (event.key === 'Enter') {
      addVariant();
      event.preventDefault();
    }
  };
  const handleTab = (event, index) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setIndex(index);
      addVariant();
    }
  };
  const handleDeleteVariant = (index, variantIndex) => () => {
    const newArray = options[index].listItems;
    newArray.splice(variantIndex, 1);
    setValue(`options[${index}].listItems`, newArray);
  };
  const swapElement = (index, variantIndex) => () => {
    const newArray = options[index].listItems;
    const tmp = newArray[variantIndex];
    newArray[variantIndex] = newArray[variantIndex + 1];
    newArray[variantIndex + 1] = tmp;
    setValue(`options[${index}].listItems`, newArray);
  };
  return (
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" aria-labelledby="customized-dialog-title">
      <DialogTitle>Thuộc tính lựa chọn sản phẩm</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">
          Mỗi sản phẩm có thể cho phép khách hàng được lựa chọn theo nhiều thuộc tính. Mỗi thuộc tính có thể có nhiều
          giá trị lựa khác nhau. Vui lòng nhấn nút Thêm thuộc tính để thêm mới
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                Tên thuộc tính lựa chọn
                <Tooltip title="Thêm thuộc tính" placement="right">
                  <IconButton color="secondary" onClick={addOption} className={classes.addIcon}>
                    <Icon>add</Icon>
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                Các giá trị lựa chọn
                <Tooltip title="Thêm giá trị" placement="right">
                  <IconButton className={classes.addIcon} color="secondary" onClick={addVariant}>
                    <Icon>add_to_queue</Icon>
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <FieldArray name="options">
              {({ fields }) =>
                fields.map((name, index) => (
                  <TableRow key={name}>
                    <TableCell className={classes.cell} component="th" scope="row">
                      <Grid container alignItems="center" justify="space-between">
                        <Field
                          key={name}
                          className={classes.widthField}
                          onClick={() => setIndex(index)}
                          onKeyDown={event => handleTab(event, index)}
                          component={TextField}
                          required
                          margin="normal"
                          placeholder="Tên thuộc tính (VD: Màu sắc, Kích thước, ...)"
                          name={`${name}.attributeName`}
                          type="text"
                          variant="outlined"
                        />
                        <Tooltip title="Xóa">
                          <IconButton onClick={() => fields.remove(index)}>
                            <Icon>delete</Icon>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </TableCell>

                    <TableCell>
                      <Grid container direction="column">
                        {fields.value[index] &&
                          currentIndex === index &&
                          fields.value[index].listItems.map((item, variantIndex) => {
                            return (
                              <React.Fragment>
                                <Grid container alignItems="baseline" justify="space-between">
                                  <Field
                                    key={`${name}-variant`}
                                    className={classes.widthField}
                                    autoFocus
                                    component={TextField}
                                    required
                                    placeholder="Giá trị của thuộc tính"
                                    name={`${name}.listItems[${variantIndex}].optionValue`}
                                    type="text"
                                    variant="outlined"
                                    onKeyPress={handleEnter}
                                  />
                                  <Tooltip title="Xóa">
                                    <IconButton onClick={handleDeleteVariant(index, variantIndex)}>
                                      <Icon>delete</Icon>
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                                {variantIndex !== fields.value[index].listItems.length - 1 && (
                                  <Grid container justify="flex-end">
                                    <IconButton
                                      onClick={swapElement(index, variantIndex)}
                                      className={classes.swapButton}
                                      color="secondary"
                                    >
                                      <Icon>import_export</Icon>
                                    </IconButton>
                                  </Grid>
                                )}
                              </React.Fragment>
                            );
                          })}
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))
              }
            </FieldArray>
          </TableBody>
        </Table>
      </DialogContent>

      <div className={classes.actions}>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={save} className={classes.btnSave} variant="contained" color="secondary">
          Lưu lựa chọn
        </Button>
      </div>
    </Dialog>
  );
};

export default withStyles(styles)(AddSelectionModal);
