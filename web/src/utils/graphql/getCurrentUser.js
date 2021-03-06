import gql from 'graphql-tag';

export default gql`
  query {
    me {
      id
      name
      email
      phone
      createdAt
      enabled
      profileMedia {
        uri
      }
      recoverable
    }
  }
`;
