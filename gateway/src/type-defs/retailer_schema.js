// @flow
import { gql } from "apollo-server-express";

export const retailerSchema = gql`
  type Retailer {
    id: ID!

    owner: Assignment

    profileMedia: Media! # Avatar
    businessName: String! #  displayed on Retailer profile and foxiny listings
    address: Address! # one to one
    businessPhone: String! # maybe different to user's phone
    businessEmail: String! # maybe different to user's phone
    # Products
    # products: [ProductRetailer!]

    # Reviews, reminder to use interface/union in yoga to resolve reviews
    #reviews: [ID!]! # list of reviews this vendor received from another members

    # Rewards

    # Orders
    # Tax
    # Billing
    # Warehouse

    enabled: Boolean!

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    retailers(query: String!): [Retailer!]!
  }

  extend type Mutation {
    registerRetailer(data: RegisterRetailer!): Retailer!
    activateReatiler(retailerId: String!): Retailer!
    deactivateReatiler(retailerId: String!): Retailer!
    updateRetailer(data: UpdateRetailerInput!): Retailer!
    deleteRetailer(retailerId: String!): Boolean!
  }

  input RegisterRetailer {
    #profileMedia
    businessName: String!
    businessEmail: String!
    businessPhone: String!
    businessAddress: CreateAddressInput!
  }

  input UpdateRetailerInput {
    #profileMedia
    businessName: String!
    businessEmail: String!
    businessPhone: String!
    businessAddress: CreateAddressInput!
  }
`;
