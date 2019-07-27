/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  TableRow,
  TableCell,
  Link,
  Button,
  Icon,
  InputBase,
} from '@material-ui/core';
import { Redirect } from 'react-router';
import { graphql, compose } from 'react-apollo';
import { debounce } from 'debounce';
import { GET_PRODUCT } from '../../../../../../utils/graphql/product';

import Loading from '../../../../../../components/Loading/Loading';
import useStyles from '../../style/approvalStyles';
import ListApproval from '../../components/ListApproval';
import {
  stableSort,
  getSorting,
} from '../../../../../../components/Table/TableUtils';

const headRows = [
  {
    id: 'name',
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
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Chi tiết',
    diabled: true,
  },
];

function ProductApproval(props) {
  // Data from server
  const { loading, productsData } = props;
  // Props of route
  const { history } = props;
  // Auth
  const { userLoggedIn } = props;
  const classes = useStyles();
  const [cloneProductData, setCloneProductData] = useState([]);
  const [isDefault, setIsDefault] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  let productTemplateId;
  // Search implementation
  // Search function
  const onSearchChangeDebounce = debounce(() => {
    const newArrayProducts = productsData.filter(
      product => product.productName.toLowerCase().includes(searchValue.toLowerCase())
        || product.sellPrice.toString().includes(searchValue)
        || product.stockQuantity.toString().includes(searchValue),
    );
    setCloneProductData(newArrayProducts);
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
  // Clone the data of products when have recieved it
  React.useEffect(() => {
    if (!loading) {
      setCloneProductData(productsData);
    }
  }, [loading, productsData]);

  // Other logics

  const detailAction = productTemplateId => () => {
    history.push(`/sellers/approve-products/${productTemplateId}`);
  };

  if (loading) return <Loading />;

  if (!userLoggedIn()) return <Redirect to="/sellers/sign" />;

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
      <ListApproval
        headRows={headRows}
        arrayLength={productsData && productsData.length}
      >
        {(page, rowsPerPage, order, orderBy) => (
          <React.Fragment>
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
                          <TableCell>
                            <Button
                              onClick={detailAction(product.productTemplateId)}
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                            >
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>

                        <TableRow key={product.productId}>
                          <TableCell component="th" scope="row">
                            <Paper
                              className={classes.productCard}
                              elevation={0}
                              square
                            >
                              <img
                                className={classes.img}
                                alt="product"
                                src={
                                  (product.productMedias[0]
                                    && product.productMedias[0].uri)
                                  || 'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
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
                            <Typography>{product.sellPrice * 1000}</Typography>
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
                        </TableRow>
                      </React.Fragment>
                    );
                  }
                  if (index === productsData.length - 1) {
                    productTemplateId = '';
                  }
                  return (
                    <TableRow key={product.productId}>
                      <TableCell component="th" scope="row">
                        <Paper
                          className={classes.productCard}
                          elevation={0}
                          square
                        >
                          <img
                            className={classes.img}
                            alt="product"
                            src={
                              (product.productMedias[0]
                                && product.productMedias[0].uri)
                              || 'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
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
                        <Typography>{product.sellPrice * 1000}</Typography>
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
                    </TableRow>
                  );
                })}
            {((productsData && productsData.length === 0)
              || (cloneProductData && cloneProductData.length === 0)) && (
              <TableRow>
                <td>Không tìm thấy dữ liệu</td>
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
    options: props => ({ variables: { sellerId: '' } }),
    props: ({ data: { loading, productsWoTemplateAfterCreated } }) => ({
      loading,
      productsData: productsWoTemplateAfterCreated,
    }),
  }),
)(ProductApproval);
