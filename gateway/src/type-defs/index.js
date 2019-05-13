// @flow
import { gql } from 'apollo-server-express';

import { userSchema } from './user_schema';
import { mediaSchema } from './media_schema';
import { addressSchema } from './address_schema';
// import { manufacturerSchema } from './manufacturer_schema';
import { retailerSchema } from './retailer_schema';
import { rolePermAssignSchema } from './rolePermAssign_schema';
import { categorySchema } from './category_schema';
import { productSchema } from './product_schema';
import { reviewSchema } from './review_schema';

const root = gql`
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
  categorySchema,
  productSchema,
  reviewSchema,
];
