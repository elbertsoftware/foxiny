/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useContext, useEffect } from 'react';
import {
  withStyles,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  MenuItem,
} from '@material-ui/core';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { TextField } from 'final-form-material-ui';
import PropTypes from 'prop-types';
import MuiTextField from '@material-ui/core/TextField';
import AddSelectionModal from './AddSelectionModal';
import { EnhancedTableToolbar } from '../../../../../../components/Table/TableUtils';
import ProductDataContext from '../../../../../../utils/context/ProductDataContext';
import SelectOutlinedInput from '../../../../../../components/TextField/SelectOutlinedInput';
import ProductEditDataContext from '../../../../../../utils/context/ProductEditDataContext';
import ApprovalContainer from '../../../../../../components/ApproveContainer/ApprovalContainer';
// import RunningModel from './RunningModel';

const styles = theme => ({
  paper: {
    marginBottom: 16,
  },
  addSelection: {
    display: 'flex',
    marginBottom: 16,
  },
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  gridContainer: {
    padding: '1rem',
  },
  tableContainer: {
    marginTop: 40,
  },
  cell: {
    padding: 10,
  },
  row: {
    height: 50,
  },
  textField: {
    height: 30,
  },
  addRow: {
    margin: '1rem 1rem 0 0',
  },
});

const attributeArr = [
  { productId: 'name', caption: 'Tên sản phẩm' },
  { productId: 'id', caption: 'Mã sản phẩm' },
  { productId: 'listPrice', caption: 'Giá niêm yết' },
  { productId: 'sellPrice', caption: 'Giá bán' },
  { productId: 'stockQuantity', caption: 'Số lượng tồn kho' },
];
const ProductProperties = ({ classes, setValue, push, pop, remove, edit, review, ...props }) => {
  const productData = useContext(edit ? ProductEditDataContext : ProductDataContext);
  const { products } = productData.data;
  const rowCount = products && products.length;
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelectedArr] = useState([]);
  const numSelected = selected.length;
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const handleCloseAndSave = () => {
    setOpenModal(false);
  };
  const onSelectAllClick = event => {
    if (event.target.checked) {
      setSelectedArr(products.map((product, index) => index));
      return;
    }
    setSelectedArr([]);
  };
  const addRowData = () => {
    push('products', undefined);
  };
  const deleteSelectedRow = () => {
    // Sort into descending order before remove by index, to avoid messing up the indexes of the yet-to-be-removeed items
    // If callback func of sort return positive value, b will go before a
    const newSelected = selected.sort((a, b) => b - a);
    newSelected.map(index => remove('products', index));
    // Delete in selected array as well
    setSelectedArr([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelectedArr(newSelected);
  };
  const isSelected = id => selected.indexOf(id) !== -1;
  const enterValueForAll = (event, key) => {
    if (event.key === 'Enter' && rowCount > 0) {
      const { value } = event.target;
      const newProduct = products.map(product => Object.assign(product, { [key]: value }));
      setValue('products', newProduct);
    }
  };
  const { options } = productData.data;
  return (
    <Paper className={classes.paper} square elevation={0}>
      <AddSelectionModal
        setValue={setValue}
        options={options}
        push={push}
        pop={pop}
        openModal={openModal}
        handleCloseModal={handleClose}
        save={handleCloseAndSave}
      />
      <div className={classes.addSelection}>
        <Typography gutterBottom variant="h6">
          Sản phẩm có nhiều lựa chọn theo màu sắc, kích cỡ ...?
        </Typography>
      </div>
      <ApprovalContainer review={review} name="checkOptions">
        <Grid container spacing={16}>
          <Grid item xs={10}>
            <Paper>
              <AppBar className={classes.bar} position="static" color="default" elevation={0}>
                <Toolbar>
                  <Grid container spacing={16} alignItems="center" justify="space-between">
                    <Typography variant="h5">Thuộc tính lựa chọn</Typography>
                    <Button onClick={handleOpen} variant="contained" color="secondary">
                      {options && options[0].listItems.length > 0 ? 'Chỉnh sửa' : 'Thêm lựa chọn'}
                    </Button>
                  </Grid>
                </Toolbar>
              </AppBar>
              {/* Show the gridContainer below if user already added selections */}
              <Grid className={classes.gridContainer} container spacing={16}>
                {options && options[0].listItems.length > 0 && (
                  <React.Fragment>
                    <Grid item xs>
                      <Typography variant="h6" gutterBottom>
                        Tên thuộc tính
                      </Typography>
                      {options.map(option => (
                        <Typography gutterBottom variant="subtitle1">
                          {option.attributeName}
                        </Typography>
                      ))}
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" gutterBottom>
                        Các lựa chọn
                      </Typography>
                      {options.map(option => (
                        <Typography key={option.name} gutterBottom>
                          {option.listItems.map(
                            (item, index) =>
                              item && `${item.optionValue} ${index !== option.listItems.length - 1 ? ', ' : ''}`,
                          )}
                        </Typography>
                      ))}
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            {/* <RunningModel classes={classes} />  */}
          </Grid>
        </Grid>
      </ApprovalContainer>
      <ApprovalContainer name="checkDetailProducts" review={review}>
        <Paper className={classes.tableContainer}>
          <EnhancedTableToolbar
            deleteRow={deleteSelectedRow}
            numSelected={selected.length}
            title="Thông tin chi tiết từng sản phẩm"
            button={
              <Button
                disabled={!options || !options[0].listItems[0]}
                className={classes.addRow}
                onClick={addRowData}
                variant="contained"
                color="secondary"
              >
                Thêm dòng
              </Button>
            }
          />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount}
                    onChange={onSelectAllClick}
                  />
                </TableCell>
                {options &&
                  options.map(option => <TableCell key={option.attributeName}>{option.attributeName}</TableCell>)}
                {attributeArr.map(attr => (
                  <TableCell style={{ paddingRight: 40 }} key={attr.productId}>
                    {attr.caption}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {options && options.map(option => <TableCell key={option.attributeName} />)}
                <TableCell key="spacing3" />
                <TableCell key="spacing4" />
                <TableCell key="spacing5" />
                {attributeArr.slice(-3).map(element => (
                  <TableCell key={element.productId} className={classes.cell}>
                    <MuiTextField
                      InputProps={{
                        className: classes.textField,
                      }}
                      onKeyPress={event => enterValueForAll(event, element.productId)}
                      fullWidth
                      required
                      helperText="Nhấn Enter để nhập cho tất cả"
                      margin="normal"
                      name={`${element.productId}`}
                      type="text"
                      variant="outlined"
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <FieldArray name="products">
                {({ fields }) =>
                  fields.map((name, index) => {
                    const wasSelected = isSelected(index);
                    return (
                      <TableRow hover role="checkbox" selected={wasSelected} key={name}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={wasSelected} onChange={event => handleClick(event, index)} />
                        </TableCell>
                        {options &&
                          options.map((option, optionIndex) => (
                            <TableCell className={classes.cell} component="th" scope="row">
                              <Field fullWidth component={SelectOutlinedInput} name={`${name}.option${optionIndex}`}>
                                {option.listItems.map(item => (
                                  <MenuItem value={item && item.optionValue}>{item && item.optionValue}</MenuItem>
                                ))}
                              </Field>
                            </TableCell>
                          ))}
                        <TableCell className={classes.cell} component="th" scope="row">
                          <Field
                            InputProps={{
                              className: classes.textField,
                            }}
                            fullWidth
                            component={TextField}
                            required
                            margin="normal"
                            name={`${name}.productName`}
                            type="text"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell className={classes.cell} component="th" scope="row">
                          <Field
                            InputProps={{
                              className: classes.textField,
                            }}
                            fullWidth
                            component={TextField}
                            required
                            margin="normal"
                            name={`${name}.productId`}
                            type="text"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell className={classes.cell} component="th" scope="row">
                          <Field
                            InputProps={{
                              className: classes.textField,
                            }}
                            fullWidth
                            component={TextField}
                            required
                            margin="normal"
                            name={`${name}.listPrice`}
                            type="text"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell className={classes.cell} component="th" scope="row">
                          <Field
                            InputProps={{
                              className: classes.textField,
                            }}
                            fullWidth
                            component={TextField}
                            required
                            margin="normal"
                            name={`${name}.sellPrice`}
                            type="text"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell className={classes.cell} component="th" scope="row">
                          <Field
                            InputProps={{
                              className: classes.textField,
                            }}
                            fullWidth
                            component={TextField}
                            required
                            margin="normal"
                            name={`${name}.stockQuantity`}
                            type="text"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </FieldArray>
            </TableBody>
          </Table>
        </Paper>
      </ApprovalContainer>
    </Paper>
  );
};

ProductProperties.propTypes = {
  review: PropTypes.bool,
  edit: PropTypes.bool,
};

ProductProperties.defaultProps = {
  review: false,
  edit: false,
};
export default withStyles(styles)(ProductProperties);
