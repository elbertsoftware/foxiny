// @flow
import { gql } from "apollo-server-express";

export const catalogSchema = gql`
  type FriendlyCatalog {
    id: ID!

    name: String!
    # localeName: String
    parentId: [String!]
    children: [String!]
    # productTemplates: [ProductTemplate!]
    # products: [FriendlyProduct!]

    createdAt: String!
    updatedAt: String!
  }

  type Brand {
    id: ID!

    brandName: String
    # products: [FriendlyProduct!]
    # manufacturer: Manufacturer @relation(name: "ManufacturerToBrand", onDelete: SET_NULL)

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    catalogs(query: String): [FriendlyCatalog!]
    brands(query: String): [Brand!]
  }

  extend type Mutation {
    createCatalog(data: [CreateCatalogInput!]!): [FriendlyCatalog!]!
    updateCatalog(data: UpdateCatalogInput): FriendlyCatalog!
    deleteCatalog(catalogIds: [String!]!): Boolean!

    createBrand(data: [CreateBrandInput]): Brand!
  }

  input CreateCatalogInput {
    name: String!
    parentId: [String!]
    children: [String!]
    # parentId:String!
  }

  input UpdateCatalogInput {
    id: String
    oldName: String
    newName: String!
    parentId: [String!]
    children: [String!]
    # oldParentId:String!
    # newParentId:String!
  }

  input CreateBrandInput {
    brandName: String!
  }
`;
