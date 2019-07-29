import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function SignUpMenu({ classes }) {
  return (
    <React.Fragment>
      <Button className={classes.button} size="large" component={Link} to="/signin" color="inherit">
        Đăng nhập
      </Button>
    </React.Fragment>
  );
}

export default SignUpMenu;
