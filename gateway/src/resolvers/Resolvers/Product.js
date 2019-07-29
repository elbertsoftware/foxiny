// @flow

import logger from "../../utils/logger";

export const Product = {
  catalog: {
    resolve: (parent, args, { request }) => {
      return parent.catalog.map(cata => {
        cata.name;
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
