// @flow
import { gql } from 'apollo-server-express';

export const staffSchema = gql`
  extend type Query {
    retailerApprovals(query: ApprovalQueryInput!): [SupportCase!]
    retailerApprovalProcesses(query: ApprovalQueryInput!): [SupportCorrespondence!]!
    lastRetailerApprovalProcess(query: ApprovalQueryInput!): [SupportCorrespondence]
    # manufacturerApproval(query: String): Approval!
  }

  extend type Mutation {
    createRetailerApprovalProcess(data: CreateRetailerApprovalProcessInput!): SupportCorrespondence!
    approveRetailer(data: ApproveRetailerInput!): Retailer!
    disapproveRetailer(data: ApproveRetailerInput!): Retailer!
    # rejectRetailer(retailerId: String!): Retailer!
    deleteRetailer(retailerId: String!): Boolean!
  }

  input CreateRetailerApprovalProcessInput {
    retailerId: String!
    subject: String
    note: String
    data: JSON!
  }

  input ApproveRetailerInput {
    retailerId: String!
    note: String
    data: JSON
  }

  input ApprovalQueryInput {
    retailerId: String
    manufacturerId: String
    last: Int
    status: String
    openedRespondedByUser: String
  }
`;
