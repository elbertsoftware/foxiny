/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  TableRow,
  TableCell,
  Link,
  Button,
  InputBase,
  Icon
} from "@material-ui/core";
import { graphql } from "react-apollo";
import { debounce } from "debounce";
import { Redirect } from "react-router";
import { LIST_APPROVAL_CASES } from "../../../../../../utils/graphql/approvement";

import Loading from "../../../../../../components/Loading/Loading";
import useStyles from "../../style/approvalStyles";
import ListApproval from "../../components/ListApproval";
import {
  stableSort,
  getSorting
} from "../../../../../../components/Table/TableUtils";

const headRows = [
  {
    id: "subject",
    numeric: false,
    disablePadding: false,
    label: "Tiêu đề"
  },
  {
    id: "status.name",
    numeric: false,
    disablePadding: false,
    label: "Tình trạng"
  },
  {
    id: "severity.name",
    numeric: false,
    disablePadding: false,
    label: "Mức độ"
  },
  {
    id: "user.name",
    numeric: false,
    disablePadding: false,
    label: "Người dùng"
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Ngày tạo"
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Chi tiết",
    diabled: true
  }
];

function SellerApproval(props) {
  const { loading, listApprovalCases, history, userLoggedIn } = props;
  const classes = useStyles();
  const [cloneCases, setCloneCases] = useState([]);
  const [sellerId, setSellerId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  // Search implementation
  // Search function
  const onSearchChangeDebounce = debounce(() => {
    const newArrayCases = listApprovalCases.filter(
      approvalCase =>
        approvalCase.subject
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        approvalCase.status.name
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        approvalCase.severity.name
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        approvalCase.openedByUser.name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );
    setCloneCases(newArrayCases);
  }, 500);

  const handleOnchange = event => {
    setSearchValue(event.target.value);
  };
  // Sau khi searchValue thay đổi, gọi hàm thực search để trả về giá trị, set IsDefault = false để map Clone Array (cloneSellers)
  // Nếu searchValue rỗng thì set IsDefault true , để chọn map Array ban đầu (sellers)
  React.useEffect(() => {
    if (searchValue !== "") {
      setIsDefault(false);
      onSearchChangeDebounce();
      return;
    }
    setIsDefault(true);
  }, [onSearchChangeDebounce, searchValue]);
  // Sau khi nhận được sellers từ server, clone sellers ấy
  React.useEffect(() => {
    if (!loading) {
      setCloneCases(listApprovalCases);
    }
  }, [listApprovalCases, loading]);
  // Others logic

  // React.useEffect(() => {
  //   if (listApprovalCases && sellerId !== '') {
  //     history.push({
  //       pathname: `/sellers/approve-sellers/${sellerId}`,
  //       state: {
  //         seller: listApprovalCases.find(seller => seller.id === sellerId),
  //       },
  //     });
  //   }
  // }, [sellerId]);

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
              input: classes.inputInput
            }}
          />
        </div>
      </div>
      <ListApproval
        headRows={headRows}
        arrayLength={listApprovalCases && listApprovalCases.length}
      >
        {(page, rowsPerPage, order, orderBy) => (
          <React.Fragment>
            {listApprovalCases &&
              stableSort(
                isDefault ? listApprovalCases : cloneCases,
                getSorting(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(approvalCase => (
                  <TableRow hover key={approvalCase.id}>
                    <TableCell component="th" scope="row">
                      <div className={classes.productCard}>
                        <img
                          className={classes.img}
                          alt="product"
                          src="https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png"
                        />
                        <div>
                          <Typography component={Link}>
                            {approvalCase.id}
                          </Typography>
                          <Typography variant="subtitle2">
                            Subject: {approvalCase.subject}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography> {approvalCase.status.name}</Typography>
                    </TableCell>
                    <TableCell>{approvalCase.severity.name}</TableCell>
                    <TableCell>{approvalCase.openedByUser.name}</TableCell>
                    <TableCell>{approvalCase.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          history.push({
                            pathname: `/sellers/approve-seller-cases/${
                              approvalCase.id
                            }`,
                            state: {
                              sellerId: approvalCase.targetIds
                            }
                          });
                          window.location.reload();
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
            {(listApprovalCases.length === 0 || cloneCases.length === 0) && (
              <TableRow className={classes.emptyDataMessage}>
                <td>Không tìm thấy dữ liệu</td>
              </TableRow>
            )}
          </React.Fragment>
        )}
      </ListApproval>
    </>
  );
}

SellerApproval.propTypes = {};

export default graphql(LIST_APPROVAL_CASES, {
  props: ({ data: { loading, retailerApprovals } }) => ({
    loading,
    listApprovalCases: retailerApprovals
  })
})(SellerApproval);
