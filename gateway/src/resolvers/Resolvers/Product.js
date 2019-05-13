// @flow

import logger from "../../utils/logger";

export const Product = {
  productId: {
    resolve: (parent, args, { request }) => {
      return parent.id;
    },
  },

  productVariantId: {
    resolve: (parent, args, { request }) => {
      return parent.variants.
    }
  }

  category: {
    resolve: (parent, args, { request }) => {
      return parent.category.map(cate => {
        cate.name;
      });
    },
  },

  description: {
    resolve: (parent, args, { request }) => {
      const description = {
        // fromManufacturer: '',
        fromRetailer: "",
      };

      // if(parent.description && parent.description.)
    },
  },
};
