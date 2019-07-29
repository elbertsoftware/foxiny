// @flow
import { gql } from 'apollo-server-express';

export const supportSchema = gql`
  # type CaseType {
  #   id: ID!
  #   _version: Int!

  #   name: String

  #   createdAt: String
  #   updatedAt: String
  # }

  type SupportStatus {
    id: ID!
    _version: Int!

    name: String!

    createdAt: String
    updatedAt: String
  }

  type SupportCategory {
    id: ID!
    _version: Int!

    name: String!
    parentId: String

    createdAt: String
    updatedAt: String
  }

  type SupportSeverity {
    id: ID!
    _version: Int!

    name: String!

    createdAt: String
    updatedAt: String
  }

  type SupportCase {
    id: ID!
    _version: Int!

    subject: String
    # caseType: CaseType!
    status: SupportStatus!
    severity: SupportSeverity!
    catergory: [SupportCategory!]
    openedByUser: User!

    targetIds: String

    # other targets

    correspondences: [SupportCorrespondence!]

    createdAt: String
    updatedAt: String
  }

  type SupportCorrespondence {
    id: ID!
    _version: Int!

    supportCase: SupportCase
    respondedBy: User
    note: String
    data: JSON

    createdAt: String
    updatedAt: String
  }

  extend type Query {
    suportStatuses: [SupportStatus!]!
    supportSeverities: [SupportSeverity!]!
  }
`;
