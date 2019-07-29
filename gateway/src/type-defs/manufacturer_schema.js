// @flow
import { gql } from "apollo-server-express";

export const manufacturerSchema = gql`
  type Manufacturer {
    id: ID!

    assistants: [Assignment!]!

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
    # Warehouse

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    manufacturers(query: String): [Manufacturer!]!
  }

  # extend type Mutation {
  # createManufacturer(data: CreateManufacturerInput!): Manufacturer!
  # updateManufacturer(data: UpdateManufacturerInput!): Manufacturer!
  # deleteManufacturer(manufacturerId: String!): Boolean!
  # }

  input CreateManufacturerInput {
    assistants: [String!] # user Ids
    #profileMedia

    businessName: String!
    businessEmail: String!
    emailConfirmCode: String
    businessPhone: String!
    phoneConfirmCode: String
    businessAddress: CreateAddressInput!
  }

  input UpdateManufacturerInput {
    # assistants: [String!] # user Ids # changing assistants should be handled by a new mutation
    #profileMedia
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
    bankAccNumber: String
    bankAccName: String
    bankName: String
    bankBranch: String
    swiftCode: String
  }
`;
