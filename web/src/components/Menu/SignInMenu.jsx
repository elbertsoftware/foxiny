import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { removeAuthorizationToken } from '../../utils/authentication';

const LOGOUT = gql`
  mutation logout($all: Boolean = false) {
    logout(all: $all) {
      token
    }
  }
`;

function SignInMenu({ currentUser }) {
  return (
    <div>
      <Mutation mutation={LOGOUT}>
        {(logout, { loading }) => (
          <React.Fragment>
            {currentUser.token && <Typography>Hello {currentUser.name}</Typography>}
            <Button
              onClick={() => {
                logout().then(({ data }) => {
                  if (data.logout.token) {
                    removeAuthorizationToken();
                    console.log('Logout sucess');
                  }
                });
              }}
              size="large"
              color="secondary"
              disabled={loading}
            >
              Đăng xuất
            </Button>
          </React.Fragment>
        )}
      </Mutation>
    </div>
  );
}

export default SignInMenu;
