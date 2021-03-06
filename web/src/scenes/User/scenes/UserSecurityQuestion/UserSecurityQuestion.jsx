import React from 'react';
import { Redirect } from 'react-router';
import { Button, Icon, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SecurityQuesForm from './components/SecurityQuesForm';

const styles = () => ({
  root: {
    margin: 'auto',
    maxWidth: '935px',
    marginTop: '50px',
    display: 'flex',
    alignItems: 'baseline',
  },
});

const UserSecurityQuestion = ({ userLoggedIn, history, classes }) => {
  if (!userLoggedIn()) {
    return <Redirect to="/signin" />;
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
