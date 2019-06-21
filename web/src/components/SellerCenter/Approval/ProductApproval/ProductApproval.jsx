/* eslint-disable react/no-array-index-key */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, TableRow, TableCell, Link, Button, Icon, InputBase } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import { debounce } from 'debounce';
import { GET_PRODUCT } from '../../../../graphql/product';

import Loading from '../../../App/Loading';
import useStyles from '../style/approvalStyles';
import ListApproval from '../components/ListApproval';
import { stableSort, getSorting } from '../../../../utils/common/TableUtils';

const headRows = [
  { id: 'productName', numeric: false, disablePadding: false, label: 'Sản phẩm' },
  { id: 'sellPrice', numeric: false, disablePadding: false, label: 'Giá bán' },
  { id: 'stockQuantity', numeric: false, disablePadding: false, label: 'Tồn kho' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Ngày tạo' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Chi tiết', diabled: true },
];

function ProductApproval(props) {
  const { loading, productsData } = props;
  const classes = useStyles();
  const [cloneProductData, setCloneProductData] = useState([]);
  const [isDefault, setIsDefault] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const onSearchChangeDebounce = debounce(() => {
    const newArrayProducts = productsData.filter(
      product =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.sellPrice.toString().includes(searchValue) ||
        product.stockQuantity.toString().includes(searchValue),
    );
    setCloneProductData(newArrayProducts);
  }, 500);

  const handleOnchange = event => {
    if (event.target.value === '') {
      setCloneProductData(productsData);
    }
    setSearchValue(event.target.value);
  };
  // Sau khi searchValue thay đổi, gọi hàm thực search để trả về giá trị
  React.useEffect(() => {
    if (searchValue !== '') {
      onSearchChangeDebounce();
    }
  }, [searchValue]);
  // Sau khi kết quả đã được trả về cloneProductData thì bắt đầu xét điều kiện
  // Trường hợp xóa searchValue => searchValue = empty thì trả lại data ban đầu sellers
  // Trường hợp searchValue có giá trị thì manipulate data với cloneProductData
  React.useEffect(() => {
    if (searchValue === '') {
      setIsDefault(true);
    } else {
      setIsDefault(false);
    }
  }, [cloneProductData]);
  // Clone the data of products at the beginning
  React.useEffect(() => {
    if (!loading) {
      setCloneProductData(productsData);
    }
  }, [loading]);

  if (loading) return <Loading />;

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
      <ListApproval headRows={headRows} arrayLength={productsData && productsData.length}>
        {(page, rowsPerPage, order, orderBy) => (
          <React.Fragment>
            {productsData &&
              stableSort(isDefault ? productsData : cloneProductData, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => (
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
                      <Typography variant="body1">{product.createdAt}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" className={classes.button}>
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            {(productsData.length === 0 || cloneProductData.length === 0) && (
              <TableRow>
                <Typography className={classes.emptyDataMessage}>Không tìm thấy dữ liệu</Typography>
              </TableRow>
            )}
          </React.Fragment>
        )}
      </ListApproval>
    </>
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
