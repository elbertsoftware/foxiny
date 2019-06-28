// @flow
import { gql } from "apollo-server-express";

import { userSchema } from "./user_schema";
import { mediaSchema } from "./media_schema";
import { addressSchema } from "./address_schema";
// import { manufacturerSchema } from './manufacturer_schema';
import { retailerSchema } from "./retailer_schema";
import { rolePermAssignSchema } from "./rolePermAssign_schema";
import { catalogSchema } from "./catalog_schema";
import { productSchema } from "./product_schema";
import { reviewSchema } from "./review_schema";

import { supportSchema } from "./support_schema";
import { staffSchema } from "./staff_schema";

const root = gql`
  scalar JSON

  type Query {
    root: Boolean
  }

  type Mutation {
    root: Boolean
  }
`;

export const schema = [
  root,
  userSchema,
  mediaSchema,
  addressSchema,
  // manufacturerSchema,
  retailerSchema,
  rolePermAssignSchema,
  catalogSchema,
  productSchema,
  reviewSchema,
  supportSchema,
  staffSchema,
];
