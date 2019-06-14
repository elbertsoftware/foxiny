// @flow
import { gql } from "apollo-server-express";

export const retailerSchema = gql`
  type Retailer {
    id: ID!

    owner: [Assignment!]

    businessCover: Media # Avatar
    businessAvatar: Media # Avatar
    businessName: String! #  displayed on Retailer profile and foxiny listings
    businessAddress: Address # one to one
    businessPhone: String! # maybe different to user's phone
    businessEmail: String!
    businessLink: String

    socialNumber: String
    socialNumberImages: [Media!]
    businessLicense: String
    businessLicenseImages: [Media!]
    # Tax
    # Billing
    # Warehouse

    # Products
    # products: [FriendlyProduct!]

    # Reviews, reminder to use interface/union in yoga to resolve reviews
    #reviews: [ID!]! # list of reviews this vendor received from another members

    # Rewards

    # Orders

    approved: Boolean

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    retailers(query: String): [Retailer!]!
    myRetailers(query: String): [Retailer!]!
  }

  extend type Mutation {
    registerRetailer(data: RegisterRetailer!): RegisterdRetailer!
    updateRetailer(retailerId: String!, data: UpdateRetailerInput!): Retailer!
    resendRetailerConfirmationCode(emailOrPhone: String!): Boolean!
    approveRetailer(retailerId: String!): Retailer!
    # rejectRetailer(retailerId: String!): Retailer!
    deleteRetailer(retailerId: String!): Boolean!
  }

  input RegisterRetailer {
    businessName: String!
    businessEmail: String!
    emailConfirmCode: String!
    businessPhone: String!
    phoneConfirmCode: String!
    businessAddress: CreateAddressInput!
  }

  input UpdateRetailerInput {
    businessName: String
    businessEmail: String
    emailConfirmCode: String
    businessPhone: String
    phoneConfirmCode: String
    businessAddress: CreateAddressInput
    businessLink: String
    socialNumber: String
    socialNumberImageIds: [String!]
    businessLicense: String
    businessLicenseImageIds: [String!]
  }

  type RegisterdRetailer {
    userId: ID!
    retailerId: ID!
  }
`;
