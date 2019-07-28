// @flow

import { gql } from "apollo-server-express";

export const systemSchema = gql`
  extend type Query {
    permissions(query: String): [Permission!]!
    roles(query: String!): [Role!]!
    assignments(query: String!): [Assignment!]!
  }

  extend type Mutation {
    # createPermission(data: CreatePermissionInput!): Permission!
    # updatePermission(data: UpdatePermissionInput!): Permission!
    # deletePermission(permissionIds: [String!]!): Boolean!
    createRole(data: CreateRoleInput!): Role!
    updateRole(data: UpdateRoleInput!): Role!
    deleteRole(roleIds: [String!]!): Boolean!

    # assign or un assign user, retailer, manufacturer, roles & permisions by these two following mutations
    # createAssignment(data: CreateAssignmentInput!): Assignment!
    # updateAssignment(data: UpdateAssingmentInput!): Assignment!
    # deleteAssignment(assignmentIds: [String!]!): Boolean!
  }

  input CreatePermissionInput {
    type: String!
    # controller: String!
    # action: String!
    # policy: String!
    enabled: Boolean!
  }

  input UpdatePermissionInput {
    id: String!

    type: String
    # controller: String
    # action: String
    enabled: Boolean
    # policy: String!
  }

  input CreateRoleInput {
    name: String! # Administrator, Assistant, Owner
    description: String!
    type: String! # root, assistant, authenticated, public
    permissionsIds: [String!]!
  }

  input UpdateRoleInput {
    id: String!

    name: String # Administrator, Assistant, Owner
    description: String
    type: String # root, assistant, authenticated, public
    permissionsIds: [String!]
  }

  input CreateAssignmentInput {
    userId: String!
    retailerId: String
    # manufacturerId: String

    roles: [String!]
    permissions: [String!]
  }

  input UpdateAssingmentInput {
    id: String!

    userId: String
    retailerId: String
    # manufacturerId: String

    roles: [String!]
    permissions: [String!]
  }
`;
