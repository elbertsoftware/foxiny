/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, TableRow, TableCell, Link, Button, InputBase, Icon } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { debounce } from 'debounce';
import { Redirect } from 'react-router';
import { ALL_RETAILERS } from '../../../../../../utils/graphql/retailer';

import Loading from '../../../../../../components/Loading/Loading';
import useStyles from '../../style/approvalStyles';
import ListApproval from '../../components/ListApproval';
import { stableSort, getSorting } from '../../../../../../components/Table/TableUtils';

const headRows = [
  { id: 'businessName', numeric: false, disablePadding: false, label: 'Nhà bán' },
  { id: 'owner', numeric: false, disablePadding: false, label: 'Người dùng tạo' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Ngày tạo' },
  { id: 'approved', numeric: false, disablePadding: false, label: 'Tình trạng' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Chi tiết', diabled: true },
];

function SellerApproval(props) {
  const { loading, sellers, history, userLoggedIn } = props;
  const classes = useStyles();
  const [cloneSellers, setCloneSellers] = useState([]);
  const [sellerId, setSellerId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  // Search implementation
  // Search function
  const onSearchChangeDebounce = debounce(() => {
    const newArraySellers = sellers.filter(
      seller =>
        seller.businessName.toLowerCase().includes(searchValue.toLowerCase()) ||
        seller.businessEmail.toLowerCase().includes(searchValue.toLowerCase()) ||
        seller.businessPhone.includes(searchValue),
    );
    setCloneSellers(newArraySellers);
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
  }, [searchValue]);
  // Sau khi nhận được sellers từ server, clone sellers ấy
  React.useEffect(() => {
    if (!loading) {
      setCloneSellers(sellers);
    }
  }, [loading]);
  // Others logic

  React.useEffect(() => {
    if (sellers && sellerId !== '') {
      history.push({
        pathname: `/sellers/approve-sellers/${sellerId}`,
        state: {
          seller: sellers.find(seller => seller.id === sellerId),
        },
      });
    }
  }, [sellerId]);

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
      <ListApproval headRows={headRows} arrayLength={sellers && sellers.length}>
        {(page, rowsPerPage, order, orderBy) => (
          <React.Fragment>
            {sellers &&
              stableSort(isDefault ? sellers : cloneSellers, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(seller => (
                  <TableRow hover key={seller.id}>
                    <TableCell component="th" scope="row">
                      <div className={classes.productCard}>
                        <img
                          className={classes.img}
                          alt="product"
                          src={
                            (seller.businessAvatar && seller.businessAvatar.uri) ||
                            'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
                          }
                        />
                        <div>
                          <Typography component={Link}>{seller.businessName}</Typography>
                          <Typography variant="subtitle2">Email: {seller.businessEmail}</Typography>
                          <Typography variant="subtitle2">Phone: {seller.businessPhone}</Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography> {seller.owner && seller.owner[0].user.name}</Typography>
                    </TableCell>
                    <TableCell>{seller.createdAt}</TableCell>
                    <TableCell>
                      <Typography>
                        {seller.enabled === null ? 'Đang chờ duyệt' : `${seller.enabled ? 'Đã duyệt' : 'Từ chối'}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSellerId(seller.id)}
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            {(sellers.length === 0 || cloneSellers.length === 0) && (
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

SellerApproval.propTypes = {};

export default graphql(ALL_RETAILERS, {
  props: ({ data: { loading, retailers } }) => ({
    loading,
    sellers: retailers,
  }),
})(SellerApproval);
