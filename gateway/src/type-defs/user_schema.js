// @flow
import { gql } from "apollo-server-express";

export const userSchema = gql`
  extend type Query {
    users(query: String): [User!]!
    me: User!
    securityQuestions: [SecurityQuestion]! # get all security questions
  }

  # user must pick three of many security question from database
  # user does not need to create their own security questions
  extend type Mutation {
    createUser(data: CreateUserInput!): User!
    confirmUser(data: ConfirmUserInput!): Boolean!
    upsertSecurityInfo(securityInfo: [QueAnsPairInput]!): User!
    resendConfirmation(data: ResendConfirmation!): Boolean!
    login(data: LoginUserInput!): AuthPayload!
    logout(all: Boolean = false): AuthPayload!
    updateUser(data: UpdateUserInput!): User!
    deleteUser: User!
    requestResetPwd(mailOrPhone: String!): SecPayload!
    resetPassword(data: ResetPasswordInput!): Boolean!
  }

  type User {
    id: ID!
    _version: Int!

    name: String!
    profile: String
    profileMedia: Media!
    badgeMedias: [Media]
    addresses: [Address!]
    #payments:[Payment]

    # In the database, sensitive fields (email, phone, password, etc.) are required, but here, they are not since we need to return null in case of non-authentication
    email: String
    phone: String
    password: String

    enabled: Boolean!
    recoverable: Boolean!

    createdAt: String!
    updatedAt: String!
  }

  type SecurityQuestion {
    id: ID!
    _version: Int!

    question: String!
    createdAt: String!
    updatedAt: String!
  }

  type SecurityInfo {
    questionId: ID!
    question: String!
    answerId: ID!
    answer: String!
  }

  input CreateUserInput {
    name: String!
    email: String
    phone: String
    password: String!
  }

  input QueAnsPairInput {
    questionId: String
    question: String
    answer: String!
  }

  input ConfirmUserInput {
    userId: ID
    email: String
    phone: String
    code: String!
  }

  # in case User has userId, consider it first
  # in case User wants to confirm and has no userId, he/she has to enter email or phone
  input ResendConfirmation {
    userId: String
    email: String
    phone: String
  }

  input LoginUserInput {
    email: String
    phone: String
    password: String!
  }

  type AuthPayload {
    userId: ID!
    hasRetailers: Boolean!
    # hasManufacturers:Boolean!
    token: String!
  }

  # user has to enter currentPWD if he/she wants to change email/phone/pwd
  input UpdateUserInput {
    name: String
    email: String
    phone: String
    password: String
    currentPassword: String
  }

  type SecPayload {
    token: String!
    securityQuestions: [SecurityQuestion]!
  }

  input ResetPasswordInput {
    securityInfo: [QueAnsPairInput]!
    password: String!
  }
`;
