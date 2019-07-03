import React, { useState, useEffect } from 'react';
import PropsType from 'prop-types';
import { Field, FormSpy } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import RichTextEditor from 'react-rte';
import { debounce } from 'debounce';
import MuiTextField from '@material-ui/core/TextField';
import {
  Typography,
  Paper,
  withStyles,
  Grid,
  Button,
  FormLabel,
  MenuItem,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
} from '@material-ui/core';
import AddBrandModal from './components/AddBrandModal';
import ApprovalContainer from '../../../../../../components/ApproveContainer/ApprovalContainer';
import ProductDataContext from '../../../../../../utils/context/ProductDataContext';

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
  dropdownContainer: {
    minWidth: 200,
    maxHeight: 300,
    overflow: 'auto',
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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const BasicInfo = ({ classes, onChange, review, ...props }) => {
  const [value, setRichTextValue] = useState(RichTextEditor.createEmptyValue());
  const [open, setOpen] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [searchBrand, setSearchBrandValue] = useState('');
  const [brandNames, setBrandName] = useState(names);
  // Lấy function setValue của Final form (Context hiện tại đang nằm trong AddProduct)
  const { setValue } = React.useContext(ProductDataContext);

  // Search implementation in Select
  const handleSearch = value => {
    setSearchBrandValue(value);
  };
  // Search
  const onSearchValueChange = debounce(() => {
    const searchedArray = names.filter(brandName => brandName.toLowerCase().includes(searchBrand.toLowerCase()));
    setBrandName(searchedArray);
  }, 200);
  // Neu co gia tri search thay doi, goi lai search Function, set isDefault = false de map clone Array (brandNames)
  // Neu khong set isDefault = true de map Array mac dinh (names)
  useEffect(() => {
    if (searchBrand !== '') {
      setIsDefault(false);
      onSearchValueChange();
      return;
    }
    setIsDefault(true);
  }, [searchBrand]);

  // Others

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onChangeValue = value => {
    setRichTextValue(value);
    if (onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      onChange(value.toString('html'));
    }
  };
  // Brandname field with Menu
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorRef, setAnchorRef] = useState(null);
  const handleOpenPopper = event => {
    setAnchorRef(event.currentTarget);
    setOpenPopper(true);
  };
  const handleClosePopper = event => {
    if (event.target.classList.contains('menuItem')) {
      return;
    }
    setOpenPopper(false);
  };
  const handleClickMenuItem = textValue => () => {
    setValue('brandName', textValue);
    setOpenPopper(false);
  };

  return (
    <Paper square elevation={0} className={classes.paper}>
      <Paper elevation={0} className={classes.category}>
        <Typography>Danh mục:</Typography>
        <Typography className={classes.categoryName}>
          <strong>Bàn gỗ</strong>
        </Typography>
      </Paper>
      <Grid container spacing={2}>
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
            <ClickAwayListener onClickAway={handleClosePopper}>
              <div className={classes.createNew}>
                <Field name="brandName" className={classes.brandField}>
                  {({ input }) => (
                    <>
                      <MuiTextField
                        {...input}
                        fullWidth
                        onFocus={handleOpenPopper}
                        required
                        margin="normal"
                        label="Thương hiệu"
                        type="text"
                        variant="outlined"
                      />
                      <Popper open={openPopper} anchorEl={anchorRef} placement="bottom-end" transition>
                        {({ TransitionProps }) => (
                          <Grow {...TransitionProps}>
                            <Paper className={classes.dropdownContainer} id="menu-list-grow">
                              <MenuList>
                                {isDefault
                                  ? names.map(brandName => (
                                      <MenuItem
                                        className="menuItem"
                                        onClick={handleClickMenuItem(brandName)}
                                        key={brandName}
                                      >
                                        {brandName}
                                      </MenuItem>
                                    ))
                                  : brandNames.map(brandName => (
                                      <MenuItem
                                        className="menuItem"
                                        onClick={handleClickMenuItem(brandName)}
                                        key={brandName}
                                      >
                                        {brandName}
                                      </MenuItem>
                                    ))}
                              </MenuList>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </>
                  )}
                </Field>
                <FormSpy
                  subscription={{ values: true, touched: true }}
                  onChange={state => {
                    const { values } = state;
                    if (values.brandName) {
                      handleSearch(values.brandName);
                    } else {
                      handleSearch('');
                    }
                  }}
                />

                <Button onClick={handleOpen} className={classes.btnCreate} variant="text" color="secondary">
                  Tạo mới
                </Button>
                <AddBrandModal openModal={open} handleCloseModal={handleClose} />
              </div>
            </ClickAwayListener>
          </ApprovalContainer>
        </Grid>
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
