import gql from 'graphql-tag';

export default gql`
  query {
    currentUser @client {
      name
      email
      phone
      token
    }
  }
`;
