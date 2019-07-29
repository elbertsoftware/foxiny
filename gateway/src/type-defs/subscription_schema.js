// @flow
import { gql } from "apollo-server-express";

export const subscriptionSchema = gql`
  extend type Subscription {
    notificationFromRetailer: SupportCase!
  }
`;
