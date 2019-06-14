/* eslint-disable react/no-array-index-key */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, TableRow, TableCell, Link, Button } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { RETAILERS } from '../../../../graphql/retailer';

import Loading from '../../../App/Loading';
import useStyles from '../style/approvalStyles';
import ListApproval from '../components/ListApproval';
import ReviewSellerModal from './ReviewSellerModal';

const columns = ['Nhà bán', 'Người dùng tạo', 'Ngày tạo', 'Tình trạng', 'Chi tiết'];

function SellerApproval(props) {
  const { loading, sellers } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const reviewComponent = useMemo(
    () => <ReviewSellerModal open={open} sellers={sellers && sellers} handleClose={handleClose} />,
    [open],
  );

  if (loading) return <Loading />;

  return (
    <ListApproval columns={columns} arrayLength={sellers.length}>
      {(page, rowsPerPage) => (
        <React.Fragment>
          {sellers &&
            sellers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(seller => (
              <TableRow key={seller.id}>
                <TableCell component="th" scope="row">
                  <Paper className={classes.productCard} elevation={0} square>
                    <img
                      className={classes.img}
                      alt="product"
                      src={
                        (seller.businessAvatar && seller.businessAvatar.uri) ||
                        'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
                      }
                    />
                    <Paper elevation={0} square>
                      <Typography component={Link}>{seller.businessName}</Typography>
                      <Typography variant="subtitle2">Email: {seller.businessEmail}</Typography>
                      <Typography variant="subtitle2">Phone: {seller.businessPhone}</Typography>
                    </Paper>
                  </Paper>
                </TableCell>
                <TableCell>{seller.owner.user.name || 'Null'}</TableCell>
                <TableCell>{seller.createdAt}</TableCell>
                <TableCell>
                  {seller.approved === null
                    ? 'Đang chờ duyệt'
                    : `${seller.approved ? 'Đã duyệt' : 'Từ chối'}` || 'Null'}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {reviewComponent}
        </React.Fragment>
      )}
    </ListApproval>
  );
}

SellerApproval.propTypes = {};

export default graphql(RETAILERS, {
  props: ({ data: { loading, myRetailers } }) => ({
    loading,
    sellers: myRetailers,
  }),
})(SellerApproval);
