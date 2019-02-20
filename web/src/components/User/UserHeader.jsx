/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Avatar, Paper, Grid, Typography, Icon, List, ListItem, ListItemText } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import getCurrentUser from '../../graphql/getCurrentUser';
import UserExpansionForm from '../Form/UserExpansionForm';
import Loading from '../App/Loading';

const styles = theme => ({
  paper: {
    maxWidth: 935,
    margin: 'auto',
    padding: '40px 30px',
    marginTop: '15px',
    marginBottom: '10px',
    borderRadius: '15px',
    backgroundColor: '#fcfcfc',
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
  recoverImage: {
    height: '100%',
    width: 'auto',
  },
  transparent: {
    witdh: '316px',
    height: '112px',
    'mix-blend-mode': 'multiply',
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    paddingLeft: 0,
    borderBottom: '1px solid grey',
  },
});

class UserHeader extends React.Component {
  render() {
    const { classes, history, match, loading, user } = this.props;
    if (loading) return <Loading />;
    return (
      <React.Fragment>
        <Paper className={classes.paper} elevation={3}>
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
              <Typography variant="h4">Thông tin tài khoản</Typography>
              <UserExpansionForm history={history} match={match} user={user} />
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="row">
            <Grid item xs={8}>
              <Typography variant="h5">Cách mà chúng tôi có thể xác minh bạn chính là chủ sở hữu tài khoản</Typography>
              <Typography variant="h6">
                Nếu bạn quên mật khẩu hoặc email, tùy chọn này có thể giúp bạn khôi phục lại tài khoản của mình.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <div className={classes.transparent}>
                <img
                  className={classes.recoverImage}
                  alt="recover"
                  aria-hidden="true"
                  src="https://www.gstatic.com/identity/boq/accountsettingsmobile/recovery_scene_632x224_98f55395b7c579a28e9060fe6b02f901.png"
                />
              </div>
            </Grid>
          </Grid>
          <List component="nav">
            <ListItem className={classes.listItem} button>
              <ListItemText primary="Câu hỏi bảo mật" />
              <Icon>navigate_next</Icon>
            </ListItem>
          </List>
        </Paper>
      </React.Fragment>
    );
  }
}
export default compose(
  graphql(getCurrentUser, {
    props: ({ data: { me } }) => ({
      user: me,
    }),
  }),
  withStyles(styles),
)(UserHeader);
