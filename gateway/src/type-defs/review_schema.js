// @flow
import { gql } from 'apollo-server-express';

export const reviewSchema = gql`
  type Review {
    id: ID!

    objectId: String! # this can be a product or a review
    authorId: User
    title: String!
    body: String!
    stars: Int!
    contentMedia: [Media!]

    createdAt: String!
    updatedAt: String!
  }
`;
