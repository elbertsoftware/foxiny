import React, { useState } from 'react';
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
  Menu,
  MenuList,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
} from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';
import Loading from '../../App/Loading';
import { Preview } from '../AddProduct/AddProductImages/AddProductImage';

const GET_PRODUCT = gql`
  query productsWoTemplateAfterCreated($sellerId: String!) {
    productsWoTemplateAfterCreated(sellerId: $sellerId) {
      productTemplateId
      productId
      name
      productName
      briefDescription
      brand
      category {
        id
        name
      }
      descriptions {
        fromRetailers
      }
      productMedias {
        uri
      }
      listPrice
      sellPrice
      stockQuantity
      inStock
      approved
      attributes {
        name
        value
      }
    }
  }
`;

const styles = {
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  table: {
    marginTop: 16,
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
};

function ListProduct(props) {
  const { classes, loading, productsData } = props;
  if (loading) return <Loading />;
  const checkedArrayObject = productsData.reduce((previous, current, index) => {
    return {
      ...previous,
      [`checked${index}`]: false,
    };
  }, {});
  const [checked, setChecked] = useState(checkedArrayObject);
  const handleChange = name => event => {
    const newObject = { ...checked };
    newObject[name] = event.target.checked;
    setChecked(newObject);
  };
  const [open, setOpen] = useState(Array(productsData.length).fill(false));
  const anchorElArr = Array(productsData.length).fill(null);
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
  const [openPreview, setOpenPreview] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleOpen = index => () => {
    setActiveIndex(index);
    setOpenPreview(true);
  };
  const handleClosePreview = () => setOpenPreview(false);

  return (
    <Paper>
      <AppBar className={classes.bar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h5">Danh sách sản phẩm</Typography>
        </Toolbar>
      </AppBar>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Sản phẩm</TableCell>
            <TableCell>Giá bán</TableCell>
            <TableCell>Tồn kho</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {productsData.map((product, index) => {
            return (
              <TableRow key={product.productId}>
                <TableCell>
                  <Paper className={classes.productCard} elevation={0} square>
                    <img
                      className={classes.img}
                      alt="product"
                      src={product.productMedias[0] && product.productMedias[0].uri}
                    />
                    <Paper elevation={0} square>
                      <Typography component={Link}>{product.productName}</Typography>
                      <Typography variant="subtitle2">ID: {product.productId}</Typography>
                    </Paper>
                  </Paper>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{product.sellPrice * 1000}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Foxiny: 0</Typography>
                  <Typography variant="body1">Nhà bán hàng: 0</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">14/05/2019 12:08:43</Typography>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checked[`checked${index}`]}
                        onChange={handleChange(`checked${index}`)}
                        value="checkedA"
                      />
                    }
                    label={checked[`checked${index}`] ? 'Bật' : 'Tắt'}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    buttonRef={node => {
                      anchorElArr[index] = node;
                    }}
                    aria-owns={open ? `manipulation${index}` : undefined}
                    aria-haspopup="true"
                    onClick={handleClick(index)}
                    className={classes.button}
                    size="small"
                    variant="contained"
                    color="secondary"
                  >
                    Thao tác
                  </Button>
                  <Popper open={open[index]} anchorEl={anchorElArr[index]} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id={`manipulation${index}`}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose(index)}>
                            <MenuList>
                              <MenuItem onClick={handleOpen(index)}>Xem trước</MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Preview
        preview
        open={openPreview}
        handleClose={handleClosePreview}
        dataForOneProduct={productsData[activeIndex]}
      />
    </Paper>
  );
}
export default compose(
  graphql(GET_PRODUCT, {
    options: props => ({ variables: { sellerId: 'cjurxpx4o00az07063f7imdn3' } }),
    props: ({ data: { loading, productsWoTemplateAfterCreated } }) => ({
      loading,
      productsData: productsWoTemplateAfterCreated,
    }),
  }),
  withStyles(styles),
)(ListProduct);
