// @flow
import { gql } from 'apollo-server-express';

export const retailerSchema = gql`
  type Retailer {
    id: ID!

    owner: Assignment

    profileMedia: Media! # Avatar
    businessName: String! #  displayed on Retailer profile and foxiny listings
    address: Address! # one to one
    phone: String! # maybe different to user's phone
    # Products

    # Reviews, reminder to use interface/union in yoga to resolve reviews
    #reviews: [ID!]! # list of reviews this vendor received from another members

    # Rewards

    # Orders
    # Tax
    # Billing

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    retailers(query: String): [Retailer!]!
  }

  extend type Mutation {
    retailerLogin(data: LoginUserInput!): AuthPayload!
    createRetailer(data: CreateRetailerInput!): Retailer!
    updateRetailer(data: UpdateRetailerInput!): Retailer!
    deleteRetailer(retailerId: String!): Boolean!
  }

  input CreateRetailerInput {
    assistants: [String!] # user Ids
    #profileMedia

    businessName: String!
    address: UpsertAddressInput!
    phone: String!
  }

  input UpdateRetailerInput {
    # assistants: [String!] # user Ids # changing assistants should be handled by a new mutation
    #profileMedia
    oldBusinessName: String
    newBusinessName: String
    address: UpsertAddressInput
    phone: String
  }
`;
