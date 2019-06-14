/* eslint-disable react/no-array-index-key */
import React, { useState, Children } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  TablePagination,
} from '@material-ui/core';
import TablePaginationActions from '../../../../utils/common/TablePaginationActions';
import useStyles from '../style/approvalStyles';

function ListApproval(props) {
  const { columns, children, arrayLength } = props;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, arrayLength - page * rowsPerPage);
  return (
    <Paper elevation={0}>
      <AppBar className={classes.bar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h5">Danh sách</Typography>
        </Toolbar>
      </AppBar>
      <Paper square>
        <Tabs value={value} indicatorColor="secondary" textColor="secondary" onChange={handleChange}>
          <Tab label="Tất cả" />
          <Tab label="Chờ duyệt" />
          <Tab label="Đã duyệt" />
          <Tab label="Từ chối" />
        </Tabs>
      </Paper>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map((columnName, index) => (
                <TableCell key={index}>{columnName}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={arrayLength}
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
          </TableHead>
          <TableBody>
            {children(page, rowsPerPage)}

            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

ListApproval.propTypes = {};

export default ListApproval;
