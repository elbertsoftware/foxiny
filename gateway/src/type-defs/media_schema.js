// @flow
import { gql } from "apollo-server-express";

export const mediaSchema = gql`
  type Media {
    id: ID!

    name: String
    ext: String
    mime: String
    size: Int
    hash: String
    sha256: String
    uri: String!

    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    uploadProfileMedia(file: Upload!): Media!
    uploadProductMedias(files: [Upload!]!): [Media!]
    uploadBusinessAvatar(file: Upload!, sellerId: String!): Media!
    uploadBusinessCover(file: Upload!, sellerId: String!): Media!
    # uploadReviewMedias(files: [Upload!]!): [Media!]!
  }
`;
