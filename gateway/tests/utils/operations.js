// @flow

import { gql } from 'apollo-boost';

// const createUser = gql`
//   mutation($data: CreateUserInput!) {
//     createUser(data: $data) {
//       token
//       user {
//         id
//         name
//         email
//       }
//     }
//   }
// `;

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      name
      email
      phone
      password
      enabled
    }
  }
`;

const getUsers = gql`
  query {
    users {
      id
      name
      email
      phone
      password
      enabled
    }
  }
`;

const login = gql`
  mutation($data: LoginUserInput!) {
    login(data: $data) {
      userId
      token
    }
  }
`;

const logout = gql`
  mutation($all: Boolean) {
    logout(all: $all) {
      token
      userId
    }
  }
`;

const getProfile = gql`
  query {
    me {
      id
      name
      email
      phone
      password
      enabled
    }
  }
`;

const confirmUser = gql`
  mutation($data: ConfirmUserInput!) {
    confirmUser(data: $data)
  }
`;

const resendConfirmation = gql`
  mutation($data: ResendConfirmation!) {
    resendConfirmation(data: $data)
  }
`;
const updateUser = gql`
  mutation($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      name
      email
      phone
      enabled
    }
  }
`;

const deleteUser = gql`
  mutation {
    deleteUser {
      id
    }
  }
`;

const requestResetPwd = gql`
  mutation($mailOrPhone: String!) {
    requestResetPwd(mailOrPhone: $mailOrPhone) {
      token
      securityQuestions {
        id
        question
      }
    }
  }
`;

const resetPassword = gql`
  mutation($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`;

const upsertSecurityInfo = gql`
  mutation($securityInfo: [QueAnsPairInput]!) {
    upsertSecurityInfo(securityInfo: $securityInfo) {
      id
      name
      email
      phone
      password
      enabled
      recoverable
    }
  }
`;

const getSecurityQuestions = gql`
  query {
    securityQuestions {
      id
      question
    }
  }
`;

const operations = {
  createUser,
  getUsers,
  login,
  logout,
  getProfile,
  confirmUser,
  resendConfirmation,
  updateUser,
  deleteUser,
  requestResetPwd,
  resetPassword,
  upsertSecurityInfo,
  getSecurityQuestions,
};

export default operations;
