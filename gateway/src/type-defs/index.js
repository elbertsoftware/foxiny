// @flow
import { gql } from "apollo-server-express";

import { addressSchema } from "./address_schema";
import { catalogSchema } from "./catalog_schema";
import { manufacturerSchema } from "./manufacturer_schema";
import { mediaSchema } from "./media_schema";
import { productSchema } from "./product_schema";
import { retailerSchema } from "./retailer_schema";
import { reviewSchema } from "./review_schema";
import { rolePermAssignSchema } from "./rolePermAssign_schema";
import { staffSchema } from "./staff_schema";
import { subscriptionSchema } from "./subscription_schema";
import { supportSchema } from "./support_schema";
import { systemSchema } from "./system_schema";
import { userSchema } from "./user_schema";
// import { manufacturerSchema } from './manufacturer_schema';

const root = gql`
  scalar JSON

  type Query {
    root: Boolean
  }

  type Mutation {
    root: Boolean
  }

  type Subscription {
    root: Boolean
  }
`;

export const schema = [
  root,
  addressSchema,
  catalogSchema,
  manufacturerSchema,
  mediaSchema,
  productSchema,
  retailerSchema,
  reviewSchema,
  rolePermAssignSchema,
  subscriptionSchema,
  supportSchema,
  staffSchema,
  systemSchema,
  userSchema,
];
