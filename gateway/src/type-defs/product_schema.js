// @flow
import { gql } from "apollo-server-express";

// TODO: claim a field to handle upload stream: productMedias
// TODO: claim enabled field to handle status of options
// TODO: constrain unique on product name/product option name

export const productSchema = gql`
  # friendly view (one variant)
  type FriendlyProduct {
    productId: ID!
    productVariantId: ID!

    name: String!
    briefDescription: String!
    brand: Brand!
    category: [Category!]!

    descriptions: [Description!]!
    productMedias: [Media!]!

    sku: String!

    listPrice: Int
    sellPrice: Int!
    stockQuantity: Int!

    inStock: Boolean!

    approved: Boolean

    # other properties

    createdAt: String! # variant's
    updatedAt: String! # variants
  }

  type Description {
    fromManufacturer: String
    fromRetailers: [String!]
  }

  # structured view (one product has many variants)
  type Product {
    id: ID!

    name: String!
    briefDescription: String!
    category: [Category!]!

    variants: [ProductVariant!]!

    brand: Brand!

    descriptions: [Description!]!

    # other properties

    createdAt: String!
    updatedAt: String!
  }

  type ProductVariant {
    id: ID!
    sku: String!
    productMedias: [String!]!

    listPrice: Int
    sellPrice: Int!
    stockQuantity: Int!

    inStock: Boolean!

    option_1_name: String
    option_1_values: String
    option_2_name: String
    option_2_values: String

    approved: Boolean

    createdAt: String!
    updatedAt: String!
  }

  type ProductVariantsList {
    productVariantsId: ID!
    productId: ID!

    name: String!
    briefDescription: String!
    brand: Brand!
    category: [Category!]!

    descriptions: [Description!]!
    productMedias: [Media!]!

    sku: String!

    option_1_name: String
    option_1_values: [String!]
    option_2_name: String
    option_2_values: [String!]

    createdAt: String!
    updatedAt: String!
  }

  type Variant {
    id: ID!

    optionName: String!

    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    friendlyProducts(query: String): [FriendlyProduct!]!
    productVariants(productId: String!): [ProductVariant!]!
    products(query: String): [Product!]!
    productDescription(query: String): [Description!]!
    # productsManufacturers(query: String): [ProductManufacturer!]!
    # productsRetailers(query: String): [ProductRetailer!]!
  }

  extend type Mutation {
    # one product but many options, ex: Product A -> A size S, A size M
    createBrandNewProductWVariants(sellerId: String!, data: [CreateNewProductInput!]): [FriendlyProduct!]
    updateProduct(sellerId: String!, data: UpdateProductInput!): Product!
    deleteProduct(sellerId: String!, productId: String!): Product!

    approveProduct(data: ApproveProductInput!): Product!

    createVariantType(data: [CreateVariantTypeInput!]): [Variant!]!
    deleteVariantType(variantIds: [String!]): [Variant!]!
  }

  input CreateNewProductInput {
    name: String!
    briefDescription: String!
    categoryIds: [String!]!

    variants: [CreateProductVariantInput!]

    brandId: String!
    detailDescription: String! # this will be moved to Description Table

    # other properties
  }
  input CreateProductVariantInput {
    listPrice: Int!
    sellPrice: Int!
    stockQuantity: Int!

    # sku: String
    productMediaIds: [String!]!

    option_1_Id: String
    option_1_value: String
    option_2_Id: String
    option_2_value: String
  }

  input UpdateProductInput {
    id: String!

    name: String!
    briefDescription: String!
    categoryIds: [String!]!
    brandId: String!
    detailDescription: String! # this will be moved to Description Table
    price: Int!
    stockQuantity: Int!
    productMediaIds: [String!]!
    # unit: Unit

    # other properties
  }

  input ApproveProductInput {
    productId: String!
    approveOrNot: Boolean!
  }

  input CreateVariantTypeInput {
    optionName: String!
  }
`;
