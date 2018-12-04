// @flow
import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const GET_ALL_USERS = gql`
  query {
    users {
      name
      email
      password

      createdAt
      updatedAt
    }
  }
`;

const UserList = () => (
  <Query query={GET_ALL_USERS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;

      return data.users.map(({ name, email, password, createdAt }) => (
        <div key={password}>
          <p>{`${name}: Joined on ${createdAt} with email: ${email}`}</p>
        </div>
      ));
    }}
  </Query>
);

export default UserList;
