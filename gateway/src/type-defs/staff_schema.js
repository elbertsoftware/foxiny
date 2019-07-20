// @flow
import { gql } from 'apollo-server-express';

export const staffSchema = gql`
  extend type Query {
    retailerApprovals(query: ApprovalQueryInput): [SupportCase!]!
    retailerApprovalProcesses(query: ApprovalQueryInput): [SupportCorrespondence!]!
    lastRetailerApprovalProcess(query: ApprovalQueryInput!): [SupportCorrespondence]!
    # manufacturerApproval(query: String): Approval!
    productApprovals(query: ApprovalQueryInput): [SupportCase!]!
  }

  extend type Mutation {
    createRetailerApprovalProcess(data: CreateApprovalProcess!): SupportCorrespondence!
    createProductApprovalProcess(data: CreateApprovalProcess!): SupportCorrespondence!
    approveRetailer(data: CreateApprovalProcess!): Int!
    disapproveRetailer(data: CreateApprovalProcess!): Int!
    # rejectRetailer(retailerId: String!): Retailer!
    deleteRetailer(retailerId: String!): Boolean!

    approveProducts(data: CreateApprovalProcess!): Int!
    disapproveProducts(data: CreateApprovalProcess!): Int!
  }

  input CreateApprovalProcess {
    caseId: String
    note: String
    data: JSON
  }

  input ApprovalQueryInput {
    skip: Int
    first: Int
    last: Int

    caseId: String
    status: String
    severity: String
    category: String
    targetIds: String # each id separated by a whitespace
    openedByUserId: String
    updatedByUserId: String
    responsedByStaffUserId: String
  }
`;
