// @flow
import { gql } from "apollo-server-express";

export const rolePermAssignSchema = gql`
  type Permission {
    id: ID!

    type: String!
    # controller: String!
    # action: String!
    # policy: String!

    createdAt: String!
    updatedAt: String!
  }

  type Role {
    id: ID!

    name: String # Administrator, Assistant, Owner
    description: String!
    type: String! # root, assistant, authenticated, public
    permissions: [Permission!]!

    createdAt: String!
    updatedAt: String!
  }

  type Assignment {
    id: ID!

    user: User!
    retailers: [Retailer!]
    # manufacturer: Manufacturer

    # roles: [Role!]
    # permissions: [Permission!]

    createdAt: String!
    updatedAt: String!
  }
`;
