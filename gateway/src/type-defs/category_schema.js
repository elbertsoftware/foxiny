// @flow
import { gql } from "apollo-server-express";

export const categorySchema = gql`
  type Category {
    id: ID!

    name: String!
    parentId: [Category!]
    productTemplates: [ProductTemplate!]
    products: [FriendlyProduct!]

    createdAt: String!
    updatedAt: String!
  }

  type Brand {
    id: ID!

    brandName: String
    products: [FriendlyProduct!]
    # manufacturer: Manufacturer @relation(name: "ManufacturerToBrand", onDelete: SET_NULL)

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    categories(query: String): [Category!]
    brands(query: String): [Brand!]
  }

  extend type Mutation {
    createCategory(data: [CreateCategoryInput!]!): [Category!]!
    updateCategory(data: UpdateCategoryInput): Category!
    deleteCategory(categoryIds: [String!]!): Boolean!

    createBrand(data: [CreateBrandInput]): Brand!
  }

  input CreateCategoryInput {
    name: String!
    parentId: [String!]
    # parentId:String!
  }

  input UpdateCategoryInput {
    id: String
    oldName: String
    newName: String!
    parentId: [String!]
    # oldParentId:String!
    # newParentId:String!
  }

  input CreateBrandInput {
    brandName: String!
  }
`;
