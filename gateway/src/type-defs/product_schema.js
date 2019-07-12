// @flow
import { gql } from "apollo-server-express";

// TODO: claim a field to handle upload stream: productMedias
// TODO: claim enabled field to handle status of options
// TODO: constrain unique on product name/product option name

export const productSchema = gql`
  type ProductTemplate {
    id: ID!
    name: String!
    briefDescription: String!
    catalog: [FriendlyCatalog!]!

    products: [FriendlyProduct!]
  }

  # friendly view (one variant)
  type FriendlyProduct {
    productTemplateId: ID
    productId: ID!

    name: String
    productName: String!
    briefDescription: String
    brand: String
    catalog: [FriendlyCatalog!]

    descriptions: Description
    productMedias: [Media!]

    sku: String

    listPrice: Int!
    sellPrice: Int!
    stockQuantity: Int!

    inStock: Boolean!

    enabled: Boolean!
    approved: Boolean

    # other properties
    attributes: [ProductAttributeValue!]

    createdAt: String! # variant's
    updatedAt: String! # variants
  }

  type ProductAttributeValue {
    attributeName: String!
    value: String!
  }

  type Description {
    # fromManufacturer: String
    fromRetailers: [String!]
  }

  extend type Query {
    productsWoTemplateAfterCreated(
      sellerId: String!
      query: String
    ): [FriendlyProduct!]!
    # productsManufacturers(query: String): [ProductManufacturer!]!
    # productsRetailers(query: String): [ProductRetailer!]!
  }

  extend type Mutation {
    # createBrandnewProduct will create a productTempalte links to many products (as variant)
    createBrandNewProductWVariants(
      sellerId: String!
      data: CreateProductWithTemplateInput!
    ): [FriendlyProduct!]

    updateProducts(
      sellerId: String!
      data: [UpdateProductInput!]!
    ): [FriendlyProduct!]

    toggleProductStatus(sellerId: String!, productId: String!): FriendlyProduct!
  }

  input CreateProductWithTemplateInput {
    name: String!
    briefDescription: String!
    catalogIds: [String!]!

    products: [CreateProductInput!]!

    brandName: String!
    detailDescription: String! # this will be moved to Description Table

    # other properties
  }

  input CreateProductInput {
    productName: String!

    listPrice: Int!
    sellPrice: Int!
    stockQuantity: Int!

    # sku: String
    productMediaIds: [String!]
    attributes: [CreateProductAttributeValue!]
  }

  input CreateProductAttributeValue {
    attributeName: String!
    value: String!
  }

  input UpdateProductInput {
    productTemplateId: String!
    productId: String!

    productName: String!

    listPrice: Int!
    sellPrice: Int!
    stockQuantity: Int!

    # sku: String
    productMediaIds: [String!]
    attributes: [CreateProductAttributeValue!]
  }

  input ApproveProductInput {
    productId: String!
    approved: Boolean!
  }
`;
