import gql from 'graphql-tag';

const LOGOUT = gql`
  mutation logout($all: Boolean = false) {
    logout(all: $all) {
      token
    }
  }
`;
const UPDATE_USER = gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      name
      email
      phone
    }
  }
`;

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

export { LOGOUT, UPDATE_USER, CONFIRM_USER, RESEND_CONFIRMATION };
