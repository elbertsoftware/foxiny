import gql from 'graphql-tag';

export default gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      name
      email
      phone
    }
  }
`;
