// @flow

import logger from "../../utils/logger";
import { checkSellerPermissions } from "../../utils/permissionChecker";
import { restructureProduct2FriendlyProduct } from "../../utils/productUtils/dataHelper";

export const Query = {
  productsWoTemplateAfterCreated: async (parent, { sellerId, approved }, { prisma, cache, request }, info) => {
    // NOTE: check permission
    await checkSellerPermissions(prisma, cache, request, sellerId);

    const newInfo = `{
      id
      productName
      listPrice
      sellPrice
      stockQuantity
      product {
        productTemplate {
          id
          name
          briefDescription
          category {
            id
            name
          }
          brand {
            id
            brandName
          }
          descriptions {
            retailer {
              id
            }
            description
          }
        }
        options {
          attribute {
            name
          }
          value {
            name
          }
        }
      }
      inStock
      productMedias {
        id
        uri
      }
      rating
      enabled
      approved
      createdAt
      updatedAt
    }`;

    const opArgs = {
      where: {
        AND: [
          {
            retailer: {
              id_contains: sellerId,
            },
          },
        ],
      },
    };

    if (approved) {
      opArgs.where.AND.push({
        approved: approved,
      });
    }

    const products = await prisma.query.productRetailers(opArgs, newInfo);
    const friendlyProducts = restructureProduct2FriendlyProduct(products);
    
    return friendlyProducts;
  },
};
