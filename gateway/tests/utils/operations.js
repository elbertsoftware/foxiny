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
      password
    }
  }
`;

const login = gql`
  mutation($data: LoginUserInput!) {
    login(data: $data) {
      token
    }
  }
`;

const logout = gql`
  mutation($all: Boolean) {
    logout(all: $all) {
      userId
      token
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
    confirmUser(data: $data) {
      id
      name
      email
      phone
      password
      enabled
    }
  }
`;

const resendConfirmation = gql`
  mutation($userId: String!) {
    resendConfirmation(userId: $userId) {
      id
      name
      email
      phone
      password
      enabled
    }
  }
`;
const updateUser = gql`
  mutation($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      name
      email
      phone
      password
      questionA
      answerA
      questionB
      answerB
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
  mutation($data: RequestResetPwdInput!) {
    requestResetPwd(data: $data) {
      token
      questionA
      questionB
    }
  }
`;

const resetPassword = gql`
  mutation($data: ResetPasswordInput!) {
    resetPassword(data: $data)
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
};

export default operations;
