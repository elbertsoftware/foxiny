// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest, checkRights } from "../../utils/authentication";
import {
  restructureProductAttributes,
  restrutureProductTemplate2FriendlyProduct,
} from "../../utils/productUtils/dataHelper";
import { validateCreateNewProductInput } from "../../utils/productUtils/validation";

// log transaction

export const Mutation = {
  createBrandNewProductWVariants: async (parent, { sellerId, data }, { prisma, request, cache }, info) => {
    try {
      // TODO: check permission
      

      // TODO: validate input
      const newData = validateCreateNewProductInput(data);

      // NOTE: 1 - create product attributes & it's values
      const atts = restructureProductAttributes(data.products);

      for (let i = 0; i < atts.length; i++) {
        for (let j = 0; j < atts[i].data.length; j++) {
          await prisma.mutation.upsertProductAttributeValue({
            where: {
              name: atts[i].data[j],
            },
            create: {
              name: atts[i].data[j],
            },
            update: {
              name: atts[i].data[j],
            },
          });
        }
        await prisma.mutation.upsertProductAttribute({
          where: {
            name: atts[i].name,
          },
          create: {
            name: atts[i].name,
            values: {
              connect: atts[i].data.map(value => ({ name: value })),
            },
          },
          update: {
            name: atts[i].name,
            values: {
              connect: atts[i].data.map(value => ({ name: value })),
            },
          },
        });
      }
      // NOTE: 2 - create product and it's template
      // NOTE: fragment ensure all needed-info always be returned
      // NOTE: lacking of manufacturer!!!
      const newInfo = `{ id name briefDescription category { id name } descriptions { retailer { id } description } brand { id brandName } products { id productName productMedias { uri } productRetailers { listPrice sellPrice stockQuantity inStock productMedias { uri } retailer { id businessName } rating approved } options { id attribute { id name } value { id name} } sku } }`;

      const productTemplateData = {
        name: data.name,
        briefDescription: data.briefDescription,
        category: {
          connect: data.categoryIds.map(id => ({ id: id })),
        },
        descriptions: {
          create: {
            description: data.detailDescription,
            retailer: {
              connect: {
                id: sellerId,
              },
            },
          },
        },
        products: {
          create: data.products.map(product => ({
            // sku:  TODO: generate SKU code here
            productName: product.productName,
            productRetailers: {
              create: {
                listPrice: product.listPrice,
                sellPrice: product.sellPrice,
                stockQuantity: product.stockQuantity,
                retailer: {
                  connect: {
                    id: sellerId,
                  },
                },
              },
            },
            productMedias: {
              connect: product.productMediaIds,
            },
            options: {
              create: product.attributes.map(att => ({
                attribute: {
                  connect: {
                    name: att.attributeName,
                  },
                },
                value: {
                  connect: {
                    name: att.value,
                  },
                },
              })),
            },
          })),
        },
        brand: {
          connect: {
            brandName: data.brandName,
          },
        },
      };

      const productTemplate = await prisma.mutation.createProductTemplate({ data: productTemplateData }, newInfo);

      // NOTE: reconstruct to-be-returned object, more friendly
      const friendlyProduct = restrutureProductTemplate2FriendlyProduct(productTemplate);

      return friendlyProduct;
    } catch (error) {
      logger.error(`ERROR_CREATE_BRANDNEW_PRODUCT_WITH_VARIANTS ${error.message}`);
      throw new Error(`Cannot create product. ${error.message}`);
    }
  },
};
