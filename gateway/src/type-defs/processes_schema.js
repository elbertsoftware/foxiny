// @flow
import { gql } from "apollo-server-express";

export const processesSchema = gql`
  scalar JSON

  enum ApprovalType {
    PRODUCT
    RETAILER
    MANUFACTURER
  }

  type Approval {
    id: ID!

    sellerId: String!
    type: ApprovalType
    isClosed: Boolean!
    processes: [ApprovalProcess!]

    createdAt: String!
    updatedAt: String!
  }

  type ApprovalProcess {
    id: ID!
    _version: Int!

    createdBy: User!
    approval: Approval!
    processData: JSON!

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    retailerApprovals(query: String): [Approval!]
    retailerApprovalProcesses(query: String): [ApprovalProcess!]!
    lastRetailerApprovalProcess(query: String!): ApprovalProcess!
    # manufacturerApproval(query: String): Approval!
  }

  extend type Mutation {
    createRetailerApprovalProcess(data: CreateRetailerApprovalProcessInput!): ApprovalProcess!
  }

  input CreateRetailerApprovalProcessInput {
    retailerId: String!
    processData: JSON!
  }
`;
