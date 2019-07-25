// @flow

import { gql } from "apollo-boost";

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

const registerRetailer = gql`
  mutation($data: registerRetailer!) {
    registerRetailer(data: $data) {
      businessName
      businessEmail
      emailConfirmCode
      businessPhone
      phoneConfirmCode
    }
  }
`;

export { registerRetailer };
