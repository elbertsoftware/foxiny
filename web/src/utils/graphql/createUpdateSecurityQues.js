import gql from 'graphql-tag';

export default gql`
  mutation upsertSecurityInfo($securityInfo: [QueAnsPairInput]!) {
    upsertSecurityInfo(securityInfo: $securityInfo) {
      id
      recoverable
    }
  }
`;
