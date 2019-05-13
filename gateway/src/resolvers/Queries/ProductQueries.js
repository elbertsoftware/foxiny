// @flow

import logger from "../../utils/logger";
import { checkPermission } from "../../utils/productUtils/permissionChecker";
import { restructureProductWoTemplate2FriendlyProduct } from "../../utils/productUtils/dataHelper";

export const Query = {
  productsWoTemplateAfterCreated: async (parent, { sellerId, approved }, { prisma, cache, request }, info) => {
    // NOTE: check permission
    await checkPermission(prisma, cache, request, sellerId);

    const newInfo = `{ id productName productMedias { uri } productRetailers { listPrice sellPrice stockQuantity inStock productMedias { uri } retailer { id businessName } rating approved } options { id attribute { id name } value { id name} } sku }`;

    const opArgs = {
      where: {
        AND: [
          {
            productRetailers_every: {
              retailer: {
                id_contains: sellerId,
              },
            },
          },
        ],
      },
    };

    if (approved) {
      opArgs.where.AND.push({
        productRetailers_every: {
          approved: approved,
        },
      });
    }

    const products = await prisma.query.products(opArgs, newInfo);
    const friendlyProducts = restructureProductWoTemplate2FriendlyProduct(products);

    return friendlyProducts;
  },
};
