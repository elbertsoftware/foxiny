import React from 'react';
import { Redirect } from 'react-router';
import { Button, Icon, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SecurityQuesForm from '../Form/SecurityQuesForm';
import Loading from '../App/Loading';

const styles = () => ({
  root: {
    margin: 'auto',
    maxWidth: '935px',
    marginTop: '50px',
    display: 'flex',
    alignItems: 'baseline',
  },
});

const UserSecurityQuestion = ({ isLoggedIn, isLoading, history, classes }) => {
  if (!isLoggedIn()) {
    return <Redirect to="/signin" />;
  }
  if (isLoading()) {
    return <Loading />;
  }
  return (
    <div>
      <div className={classes.root}>
        <Button onClick={() => history.goBack()}>
          <Icon>arrow_back</Icon>
        </Button>
        <Typography variant="h3">Câu hỏi bảo mật</Typography>
      </div>
      <SecurityQuesForm history={history} />
    </div>
  );
};
export default withStyles(styles)(UserSecurityQuestion);
