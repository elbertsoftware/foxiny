import React, { useState, useMemo } from 'react';
import {
  withStyles,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Link,
  FormControlLabel,
  Switch,
  MenuList,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  Icon,
  Slide,
  Dialog,
  InputBase,
  TableFooter,
  TablePagination,
} from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import { Redirect } from 'react-router';
import { debounce } from 'debounce';
import Loading from '../../../../components/Loading/Loading';
import EditProduct from './components/EditSpecificProduct';
import { GET_PRODUCT } from '../../../../utils/graphql/product';
import { getSellerId } from '../../../../utils/processData/localStorage';
import {
  EnhancedTableHead,
  TablePaginationActions,
  stableSort,
  getSorting,
} from '../../../../components/Table/TableUtils';

const styles = ({
 spacing, transitions, breakpoints, palette, shape 
}) => ({
  bar: {
    marginTop: spacing(3),
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  table: {
    marginTop: 16,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  img: {
    width: 200,
    height: 200,
    objectFit: 'contain',
    marginRight: 8,
  },
  button: {
    width: '5rem',
    height: '2rem',
    borderRadius: '30px',
  },
  productCard: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 16,
  },
  icon: {
    fontSize: 15,
    marginRight: 4,
  },
  // For search bar
  searchContainer: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    marginRight: 8,
    borderRadius: shape.borderRadius,
    background: palette.grey[200],
    '&:hover': {
      background: palette.grey[300],
    },
    marginLeft: 0,
    width: '30%',
    [breakpoints.up('sm')]: {
      marginLeft: spacing.unit,
      width: 'auto',
      minWidth: 300,
    },
  },
  searchIcon: {
    width: spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    borderRadius: 4,
    paddingTop: spacing.unit,
    paddingRight: spacing.unit,
    paddingBottom: spacing.unit,
    paddingLeft: spacing.unit * 10,
    transition: transitions.create('width'),
    width: '100%',
    [breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 320,
      },
    },
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const headRows = [
  {
    id: 'productName',
    numeric: false,
    disablePadding: false,
    label: 'Sản phẩm',
  },
  {
    id: 'sellPrice',
    numeric: false,
    disablePadding: false,
    label: 'Giá bán',
  },
  {
    id: 'stockQuantity',
    numeric: false,
    disablePadding: false,
    label: 'Tồn kho',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Ngày tạo',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái',
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Chi tiết',
    diabled: true,
  },
];

function ListProduct(props) {
  const {
 classes, loading, productsData, userLoggedIn 
} = props;

  const [cloneProductData, setCloneProductData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(headRows && headRows[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Pagination
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  // Search implementation
  // Search function
  const onSearchChangeDebounce = debounce(() => {
    const newProducts = productsData.filter(
      product => product.productName.toLowerCase().includes(searchValue.toLowerCase())
        || product.productId.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setCloneProductData(newProducts);
  }, 500);

  const handleOnchange = event => {
    setSearchValue(event.target.value);
  };
  // Sau khi searchValue thay đổi, gọi hàm thực search để trả về giá trị, set IsDefault = false để map Clone Array (cloneSellers)
  // Nếu searchValue rỗng thì set IsDefault true , để chọn map Array ban đầu (sellers)
  React.useEffect(() => {
    if (searchValue !== '') {
      setIsDefault(false);
      onSearchChangeDebounce();
      return;
    }
    setIsDefault(true);
  }, [onSearchChangeDebounce, searchValue]);
  // Sau khi nhận được sellers từ server, clone sellers ấy
  React.useEffect(() => {
    if (!loading) {
      setCloneProductData(productsData);
    }
  }, [loading, productsData]);

  // Init component
  const checkedArrayObject =    !loading
    && productsData.reduce(
      (previous, current, index) => ({
        ...previous,
        [`checked${index}`]: false,
      }),
      {},
    );
  const [checked, setChecked] = useState(checkedArrayObject);
  // Bật tắt bán hàng
  const handleChange = name => event => {
    const newObject = { ...checked };
    newObject[name] = event.target.checked;
    setChecked(newObject);
  };
  const [open, setOpen] = useState(
    Array(productsData && productsData.length).fill(false),
  );
  const anchorElArr = Array(productsData && productsData.length).fill(null);
  const handleClick = index => () => {
    if (anchorElArr[index] !== null) {
      const newOpenArr = Array.from(open);
      newOpenArr[index] = !newOpenArr[index];
      setOpen(newOpenArr);
    }
  };

  const handleClose = index => event => {
    if (anchorElArr[index].contains(event.target)) {
      return;
    }
    setOpen(false);
    anchorElArr[index] = null;
  };
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [activeProductTemplateId, setProductTemplateId] = useState('');
  const handleOpenDialog = productTemplateId => () => {
    setProductTemplateId(productTemplateId);
    setOpenEditDialog(true);
  };
  const handleCloseDialog = () => setOpenEditDialog(false);

  const editComponent = useMemo(
    () => (
      <Dialog
        fullScreen
        open={openEditDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Chỉnh sửa sản phẩm
            </Typography>
            <Button color="inherit" onClick={handleCloseDialog}>
              Đóng
            </Button>
          </Toolbar>
        </AppBar>
        <EditProduct
          dataEdit={
            productsData
            && productsData.filter(
              product => product.productTemplateId === activeProductTemplateId,
            )
          }
        />
      </Dialog>
    ),
    [activeProductTemplateId, classes.appBar, classes.flex, openEditDialog, productsData],
  );
  let productTemplateId;
  if (loading) return <Loading />;
  if (!userLoggedIn()) {
    return <Redirect to="/sellers/signin" />;
  }

  return (
    <>
      <div className={classes.searchContainer}>
        <div className={classes.grow} />
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Icon>search</Icon>
          </div>
          <InputBase
            onChange={handleOnchange}
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
      </div>
      <Paper>
        <AppBar
          className={classes.bar}
          position="static"
          color="default"
          elevation={0}
        >
          <Toolbar>
            <Typography variant="h5">Danh sách sản phẩm</Typography>
          </Toolbar>
        </AppBar>
        <Table className={classes.table}>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headRows={headRows}
          />
          <TableBody>
            {productsData
              && stableSort(
                isDefault ? productsData : cloneProductData,
                getSorting(order, orderBy),
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => {
                  if (productTemplateId !== product.productTemplateId) {
                    productTemplateId = product.productTemplateId;
                    return (
                      <React.Fragment>
                        <TableRow>
                          <TableCell>
                            <Typography>
                              <strong>Name: </strong> 
{' '}
{product.name}
                            </Typography>
                            <Typography>
                              <strong>Product Template ID: </strong>
{" "}
                              {product.productTemplateId}
                            </Typography>
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell>
                            <Button
                              buttonRef={node => {
                                anchorElArr[index] = node;
                              }}
                              aria-owns={
                                open ? `manipulation${index}` : undefined
                              }
                              aria-haspopup="true"
                              onClick={handleClick(index)}
                              className={classes.button}
                              size="small"
                              variant="contained"
                              color="secondary"
                            >
                              Thao tác
                            </Button>
                            <Popper
                              open={open[index]}
                              anchorEl={anchorElArr[index]}
                              transition
                              disablePortal
                            >
                              {({ TransitionProps, placement }) => (
                                <Grow
                                  {...TransitionProps}
                                  id={`manipulation${index}`}
                                  style={{
                                    transformOrigin:
                                      placement === 'bottom'
                                        ? 'center top'
                                        : 'center bottom',
                                  }}
                                >
                                  <Paper>
                                    <ClickAwayListener
                                      onClickAway={handleClose(index)}
                                    >
                                      <MenuList>
                                        <MenuItem
                                          onClick={handleOpenDialog(
                                            product.productTemplateId,
                                          )}
                                        >
                                          <Icon className={classes.icon}>
                                            edit
                                          </Icon>
{" "}
                                          Sửa
                                        </MenuItem>
                                      </MenuList>
                                    </ClickAwayListener>
                                  </Paper>
                                </Grow>
                              )}
                            </Popper>
                          </TableCell>
                        </TableRow>
                        <TableRow key={product.productId}>
                          <TableCell>
                            <Paper
                              className={classes.productCard}
                              elevation={0}
                              square
                            >
                              <img
                                className={classes.img}
                                alt="product"
                                src={
                                  product.productMedias[0]
                                  && product.productMedias[0].uri
                                }
                              />
                              <Paper elevation={0} square>
                                <Typography component={Link}>
                                  {product.productName}
                                </Typography>
                                <Typography variant="subtitle2">
                                  ID: 
{' '}
{product.productId}
                                </Typography>
                              </Paper>
                            </Paper>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {product.sellPrice * 1000}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">Foxiny: 0</Typography>
                            <Typography variant="body1">
                              Nhà bán hàng: 
{' '}
{product.stockQuantity}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {product.createdAt}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={(
<Switch
                                  checked={checked[`checked${index}`]}
                                  onChange={handleChange(`checked${index}`)}
                                  value="checkedA"
                                />
)}
                              label={checked[`checked${index}`] ? 'Bật' : 'Tắt'}
                            />
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  }
                  if (index === productsData.length - 1) {
                    productTemplateId = '';
                  }
                  return (
                    <TableRow key={product.productId}>
                      <TableCell>
                        <Paper
                          className={classes.productCard}
                          elevation={0}
                          square
                        >
                          <img
                            className={classes.img}
                            alt="product"
                            src={
                              product.productMedias[0]
                              && product.productMedias[0].uri
                            }
                          />
                          <Paper elevation={0} square>
                            <Typography component={Link}>
                              {product.productName}
                            </Typography>
                            <Typography variant="subtitle2">
                              ID: 
{' '}
{product.productId}
                            </Typography>
                          </Paper>
                        </Paper>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {product.sellPrice * 1000}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">Foxiny: 0</Typography>
                        <Typography variant="body1">
                          Nhà bán hàng: 
{' '}
{product.stockQuantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {product.createdAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={(
<Switch
                              checked={checked[`checked${index}`]}
                              onChange={handleChange(`checked${index}`)}
                              value="checkedA"
                            />
)}
                          label={checked[`checked${index}`] ? 'Bật' : 'Tắt'}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            {(productsData.length === 0 || cloneProductData.length === 0) && (
              <TableRow className={classes.emptyDataMessage}>
                <td>Không tìm thấy dữ liệu</td>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell />
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={productsData && productsData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Dòng mỗi trang' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
        {editComponent}
      </Paper>
    </>
  );
}
export default compose(
  graphql(GET_PRODUCT, {
    options: props => ({ variables: { sellerId: getSellerId() } }),
    props: ({ data: { loading, productsWoTemplateAfterCreated } }) => ({
      loading,
      productsData: productsWoTemplateAfterCreated,
    }),
  }),
  withStyles(styles),
)(ListProduct);
