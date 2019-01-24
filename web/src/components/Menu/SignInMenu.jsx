import React from 'react';
import { Button } from '@material-ui/core';
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

function SignInMenu({ handleRemoveToken }) {
  return (
    <div>
      <Mutation mutation={LOGOUT}>
        {(logout, { loading }) => (
          <Button
            onClick={() => {
              logout().then(({ data }) => {
                if (data.logout.token) {
                  removeAuthorizationToken();
                  handleRemoveToken();
                }
              });
            }}
            size="large"
            color="secondary"
            disabled={loading}
          >
            Đăng xuất
          </Button>
        )}
      </Mutation>
    </div>
  );
}

export default SignInMenu;
