/* eslint-disable react/no-array-index-key */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, TableRow, TableCell, Link, Button } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import { GET_PRODUCT } from '../../../../graphql/product';

import Loading from '../../../App/Loading';
import useStyles from '../style/approvalStyles';
import ListApproval from '../components/ListApproval';
import EditProduct from '../../ListProducts/EditProduct';

const columns = ['Sản phẩm', 'Giá bán', 'Tồn kho', 'Ngày tạo', 'Chi tiết'];

function ProductApproval(props) {
  const { loading, productsData } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const editComponent = useMemo(
    () => <EditProduct review open={open} handleClose={handleClose} dataEdit={productsData && productsData} />,
    [open],
  );

  if (loading) return <Loading />;

  return (
    <ListApproval columns={columns} arrayLength={productsData && productsData.length}>
      {(page, rowsPerPage) => (
        <React.Fragment>
          {productsData &&
            productsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, index) => (
              <TableRow key={product.productId}>
                <TableCell component="th" scope="row">
                  <Paper className={classes.productCard} elevation={0} square>
                    <img
                      className={classes.img}
                      alt="product"
                      src={
                        (product.productMedias[0] && product.productMedias[0].uri) ||
                        'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
                      }
                    />
                    <Paper elevation={0} square>
                      <Typography component={Link}>{product.productName}</Typography>
                      <Typography variant="subtitle2">ID: {product.productId}</Typography>
                    </Paper>
                  </Paper>
                </TableCell>
                <TableCell>
                  <Typography>{product.sellPrice * 1000}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Foxiny: 0</Typography>
                  <Typography variant="body1">Nhà bán hàng: {product.stockQuantity}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">14/05/2019 12:08:43</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {editComponent}
        </React.Fragment>
      )}
    </ListApproval>
  );
}

ProductApproval.propTypes = {};

export default compose(
  graphql(GET_PRODUCT, {
    options: props => ({ variables: { sellerId: 'cjurxpx4o00az07063f7imdn3' } }),
    props: ({ data: { loading, productsWoTemplateAfterCreated } }) => ({
      loading,
      productsData: productsWoTemplateAfterCreated,
    }),
  }),
)(ProductApproval);
