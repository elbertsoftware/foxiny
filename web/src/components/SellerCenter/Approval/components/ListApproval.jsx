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
  TableRow,
  TableCell,
  Tabs,
  Tab,
  TablePagination,
  TableFooter,
  InputBase,
  Icon,
} from '@material-ui/core';
import TablePaginationActions from '../../../../utils/common/TablePaginationActions';
import useStyles from '../style/approvalStyles';
import { EnhancedTableHead } from '../../../../utils/common/TableUtils';

function ListApproval(props) {
  const { headRows, children, arrayLength } = props;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(headRows && headRows[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, arrayLength - page * rowsPerPage);
  return (
    <Paper elevation={0}>
      <AppBar className={classes.bar} position="static" color="inherit" elevation={0}>
        <Toolbar className={classes.toolbar}>
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
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} headRows={headRows} />
          <TableBody>
            {children(page, rowsPerPage, order, orderBy)}

            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
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
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
}

ListApproval.propTypes = {};

export default ListApproval;
