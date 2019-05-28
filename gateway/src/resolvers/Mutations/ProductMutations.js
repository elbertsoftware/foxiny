// @flow

import logger from '../../utils/logger';
import { getUserIDFromRequest, checkRights } from '../../utils/authentication';
import {
  restructureProductAttributes,
  restrutureProductTemplate2FriendlyProduct,
  restructureProductRetailer2FriendlyProduct,
} from '../../utils/productUtils/dataHelper';
import { validateCreateNewProductInput } from '../../utils/productUtils/validation';
import { checkPermission } from '../../utils/productUtils/permissionChecker';
import { s3ProductMediasUploader } from '../../utils/s3Uploader';

// TODO:
// log transaction
// generate sku

export const Mutation = {
  createBrandNewProductWVariants: async (parent, { sellerId, data }, { prisma, request, cache }, info) => {
    try {
      // NOTE: check permission
      await checkPermission(prisma, cache, request, sellerId);

      // NOTE: validate input
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
      const newInfo = `{ id name briefDescription category { id name } descriptions { retailer { id } description } brand { id brandName } products { id productMedias { uri } productRetailers { id productName listPrice sellPrice stockQuantity inStock productMedias { uri } retailer { id businessName } rating approved createdAt updatedAt } options { id attribute { id name } value { id name} } sku } createdAt updatedAt }`;

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
            productRetailers: {
              create: {
                productName: product.productName,
                listPrice: product.listPrice,
                sellPrice: product.sellPrice,
                stockQuantity: product.stockQuantity,
                productMedias:
                  product.productMediaIds && product.productMediaIds.length > 0
                    ? {
                        connect: product.productMediaIds.map(mediaId => ({
                          id: mediaId,
                        })),
                      }
                    : undefined,
                retailer: {
                  connect: {
                    id: sellerId,
                  },
                },
              },
            },
            // productMedias:
            //   product.productMediaIds && product.productMediaIds.length > 0
            //     ? {
            //         connect: product.productMediaIds.map(mediaId => ({
            //           id: mediaId,
            //         })),
            //       }
            //     : undefined,
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
      logger.error(`ERROR_CREATE_BRANDNEW_PRODUCT_WITH_VARIANTS ${error}`);
      throw new Error(`Cannot create product. ${error.message}`);
    }
  },

  updateProducts: async (parent, { sellerId, data }, { prisma, request, cache }, info) => {
    // NOTE: check permission
    await checkPermission(prisma, cache, request, sellerId);

    // TODO: validate input

    // NOTE: 1 - create product attributes & it's values
    const atts = restructureProductAttributes(data);

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

    // NOTE: 2 - update
    const updatedProducts = await Promise.all(
      data.map(async product => {
        await prisma.mutation.updateProductRetailer({
          where: {
            id: product.id,
          },
          data: {
            productMedias: {
              deleteMany: {
                id_not: '',
              },
            },
          },
        });

        // TODO: check if there is any entity in reference to this product -> cannot update but create the new one
        const existedProduct = await prisma.query.productRetailers({
          where: {
            id: product.id,
            product: {
              AND: product.attributes.map(pair => ({
                options_some: {
                  AND: [
                    {
                      attribute: {
                        name: pair.attributeName,
                      },
                      value: {
                        name: pair.value,
                      },
                    },
                  ],
                },
              })),
            },
          },
        });
        if (existedProduct && existedProduct.length > 0) {
          return await prisma.mutation.updateProductRetailer(
            {
              where: {
                id: product.id,
              },
              data: {
                productName: product.productName,
                listPrice: product.listPrice,
                sellPrice: product.sellPrice,
                stockQuantity: product.stockQuantity,
                productMedias:
                  product.productMediaIds && product.productMediaIds.length > 0
                    ? {
                        connect: product.productMediaIds.map(mediaId => ({
                          id: mediaId,
                        })),
                      }
                    : undefined,
              },
            },
            '{id productName listPrice sellPrice stockQuantity inStock productMedias { uri } product { productTemplate { id name briefDescription brand { id brandName } category { id name } descriptions { retailer { id } description } } options { attribute { name } value { name } } } rating approved createdAt updatedAt }',
          );
        } else {
          // NOTE: delete old product retailer
          await prisma.mutation.deleteProductRetailer({
            where: {
              id: product.id,
            },
          });

          return await prisma.mutation.createProductRetailer(
            {
              data: {
                productName: product.productName,
                listPrice: product.listPrice,
                sellPrice: product.sellPrice,
                stockQuantity: product.stockQuantity,
                retailer: {
                  connect: {
                    id: sellerId,
                  },
                },
                product: {
                  create: {
                    productTemplate: {
                      connect: {
                        id: product.productTemplateId,
                      },
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
                  },
                },
              },
            },
            '{id productName listPrice sellPrice stockQuantity inStock productMedias { uri } product { productTemplate { id name briefDescription brand { id brandName } category { id name } descriptions { retailer { id } description } } options { attribute { name } value { name } } } rating approved createdAt updatedAt }',
          );
        }
      }),
    );

    console.log(JSON.stringify(restructureProductRetailer2FriendlyProduct(updatedProducts), undefined, 2));
    return restructureProductRetailer2FriendlyProduct(updatedProducts);
  },
};
