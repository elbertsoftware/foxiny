// @flow

import { pubsubConfig } from "./SubscriptionConfig";
import { gatekeeper } from "../../utils/permissionChecker";

export const Subscriptions = {
  notificationFromRetailer: {
    subscribe: async (parent, args, { i18n, pubsub, connection }, info) => {
      // assign x-forwarded-for
      console.log(JSON.stringify(connection, undefined, 2));
      console.log(connection.context["X-Forwarded-For"]);
      const user = await gatekeeper.checkPermissions(connection, "STAFF", i18n);

      return pubsub.asyncIterator([
        pubsubConfig.RETAILER_CREATED,
        pubsubConfig.RETAILER_UPDATE_PROFILE,
        pubsubConfig.PRODUCT_CREATED,
        pubsubConfig.PRODUCT_UPDATED,
      ]);
    },
  },
};
