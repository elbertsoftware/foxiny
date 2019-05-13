// @flow
import { gql } from "apollo-server-express";

export const mediaSchema = gql`
  type Media {
    id: ID!

    name: String!
    ext: String!
    mime: String!
    size: Int!
    hash: String
    sha256: String
    uri: String!

    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    uploadProfileMedia(file: Upload!): Media!
    uploadProductMedias(productId: String!, files: [Upload!]!): [Media!]!
    # uploadReviewMedias(files: [Upload!]!): [Media!]!
  }
`;
