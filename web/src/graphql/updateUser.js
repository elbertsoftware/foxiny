import gql from 'graphql-tag';

export default gql`
  mutation updateUser($data: UserInfo!) {
    updateUser(data: $data) @client {
      name
      email
      phone
      token
    }
  }
`;
