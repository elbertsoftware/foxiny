// @flow

import logger from "../../utils/logger";

export const Query = {
  productsAfterCreated: async (parent, { query }, { prisma, request }, info) => {
    

    const newInfo = `{ id productMedias { uri } productRetailers { listPrice sellPrice stockQuantity inStock productMedias { uri } retailer { id businessName } rating approved } options { id attribute { id name } value { id name} } sku }`;

    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            id_contains: query,
          },
          {
            productName_contains: query,
          },
        ],
      };
    }

    const products = await prisma.query.products(opArgs, newInfo);
    console.log(JSON.stringify(products, undefined, 2));
  },
};
