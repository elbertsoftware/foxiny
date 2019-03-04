import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function SignUpMenu({ classes }) {
  return (
    <div className={classes.signUpMenu}>
      <Button className={classes.button} size="large" component={Link} to="/signin" color="secondary">
        Đăng nhập
      </Button>
      <Button variant="contained" size="large" component={Link} to="/signup" color="secondary">
        Đăng ký
      </Button>
    </div>
  );
}

export default SignUpMenu;
