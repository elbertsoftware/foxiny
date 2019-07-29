// @flow

import logger from '../../utils/logger';
import { gatekeeper } from '../../utils/permissionChecker';
import { restructureProduct2FriendlyProduct } from '../../utils/productUtils/dataHelper';

export const Query = {
  productsWoTemplateAfterCreated: async (
    parent,
    { sellerId, approved },
    {
 prisma, cache, request, i18n 
},
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      'CREATE_RETAIL_PRODUCT',
      i18n,
    );

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
          catalog {
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
        approved,
      });
    }

    const products = await prisma.query.productRetailers(opArgs, newInfo);
    const friendlyProducts = restructureProduct2FriendlyProduct(products);

    return friendlyProducts;
  },

  getProducts: async (
    parent,
    { query },
    {
 prisma, cache, request, i18n 
},
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      'DAPPROVE_PRODUCT_REGISTRATION',
      i18n,
    );

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
          catalog {
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
      orderBy: 'updatedAt_DESC',
      skip: query && query.skip ? query.skip : undefined,
      last: query && query.last ? query.last : undefined,
      first: query && query.first ? query.first : undefined,
      where: {
        AND: [
          {
            product: {
              productTemplate: query.productTemplateId
                ? {
                  id_contains: query.productTemplateId,
                }
                : undefined,
              id_in:
                query.productIds && query.productIds.length > 0
                  ? query.productIds
                  : undefined,
            },
          },
          {
            retailer: query.sellerId
              ? {
                id_contains: query.sellerId,
              }
              : undefined,
          },
        ],
      },
    };

    const products = await prisma.query.productRetailers(opArgs, newInfo);
    const friendlyProducts = restructureProduct2FriendlyProduct(products);

    return friendlyProducts;
  },
};
