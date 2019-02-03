import gql from 'graphql-tag';

const CONFIRM_USER = gql`
  mutation confirmUser($data: ConfirmUserInput!) {
    confirmUser(data: $data) {
      enabled
    }
  }
`;

const RESEND_CONFIRMATION = gql`
  mutation resendConfirmation($userId: String!) {
    resendConfirmation(userId: $userId) {
      id
    }
  }
`;

export { CONFIRM_USER, RESEND_CONFIRMATION };
