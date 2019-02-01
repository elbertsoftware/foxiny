/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {
  Avatar,
  Paper,
  Grid,
  Typography,
  Icon,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import getCurrentUser from '../../graphql/getCurrentUser';

const styles = theme => ({
  paper: {
    maxWidth: 935,
    margin: 'auto',
    padding: '40px 30px',
    marginTop: '20px',
  },
  personal: {
    flex: '1 0 auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing.unit * 2,
  },
  avatar: {
    width: 200,
    height: 200,
  },
  accountInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  light: {
    fontSize: 15,
    color: '#657786',
    marginLeft: theme.spacing.unit,
  },
  iconTextLight: {
    fontSize: 15,
    color: '#657786',
  },
  lightWeight: {
    fontWeight: 300,
  },
  table: {
    margin: '20px 0px',
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center',
  },
  grow: {
    flexGrow: 1,
  },
});

class UserHeader extends React.Component {
  render() {
    const { classes, match, loading, user } = this.props;
    if (loading) return <p>Loading...</p>;
    return (
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={4}>
            <Avatar className={classes.avatar} src="http://i.pravatar.cc/150?img=68" alt="Avatar" />
            <div className={classes.content}>
              <div className={classes.personal}>
                <Typography component="h1" variant="h4" className={classes.lightWeight}>
                  {user.name}
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  {user.email || user.phone}
                </Typography>
              </div>
              <div className={classes.accountInfo}>
                <Icon className={classes.iconTextLight}>calendar_today</Icon>
                <Typography variant="subtitle1" className={classes.light} gutterBottom>
                  Tham gia ngày {moment(user.createdAt).format('DD/MM/YYYY')}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={8}>
            <Typography component="h3" variant="h4">
              Thông tin tài khoản
            </Typography>
            <Table className={classes.table}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className={classes.tableCell}>
                      <div className={classes.grow}>
                        <Typography variant="subtitle1">
                          <b>Tên:</b>
                        </Typography>
                        <Typography variant="body2">{user.nauser}</Typography>
                      </div>
                      <div>
                        <Button variant="contained">Sửa</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className={classes.tableCell}>
                      <div className={classes.grow}>
                        <Typography variant="subtitle1">
                          <b>Email:</b>
                        </Typography>
                        <Typography variant="body2">{user.email || 'Chưa có thông tin.'}</Typography>
                      </div>
                      <div>
                        <Button variant="contained">Sửa</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className={classes.tableCell}>
                      <div className={classes.grow}>
                        <Typography variant="subtitle1">
                          <b>Số điện thoại</b>
                        </Typography>
                        <Typography variant="body2">{user.phone || 'Chưa có thông tin.'}</Typography>
                      </div>
                      <div>
                        <Button variant="contained">Sửa</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className={classes.tableCell}>
                      <div className={classes.grow}>
                        <Typography variant="subtitle1">
                          <b>Mật khẩu</b>
                        </Typography>
                        <Typography variant="body2">●●●●●●●●</Typography>
                      </div>
                      <div>
                        <Button variant="contained">Sửa</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
export default compose(
  graphql(getCurrentUser, {
    props: ({ data: { loading, me } }) => ({
      loading,
      user: me,
    }),
  }),
  withStyles(styles),
)(UserHeader);
