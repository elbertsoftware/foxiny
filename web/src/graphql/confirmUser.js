import gql from 'graphql-tag';

const CONFIRM_USER = gql`
  mutation confirmUser($data: ConfirmUserInput!) {
    confirmUser(data: $data)
  }
`;

const RESEND_CONFIRMATION = gql`
  mutation resendConfirmation($data: ResendConfirmation!) {
    resendConfirmation(data: $data)
  }
`;

export { CONFIRM_USER, RESEND_CONFIRMATION };
