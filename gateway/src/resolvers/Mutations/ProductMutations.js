// @flow

import { t } from '@lingui/macro';
import logger from '../../utils/logger';
import { getUserIDFromRequest, checkRights } from '../../utils/authentication';
import {
  restructureProductAttributes,
  restrutureProductTemplate2FriendlyProduct,
  restructureProductRetailer2FriendlyProduct,
} from '../../utils/productUtils/dataHelper';
import {
  validateCreateNewProductInput,
  validateUpdateProductInput,
} from '../../utils/productUtils/validation';
import { gatekeeper } from '../../utils/permissionChecker';
import { s3ProductMediasUploader } from '../../utils/s3Uploader';
import { getLanguage } from '../../utils/i18nHelper';

// TODO:
// log transaction
// generate sku

export const Mutation = {
  createBrandNewProductWVariants: async (
    parent,
    { sellerId, data },
    {
 prisma, request, cache, i18n 
},
    info,
  ) => {
    try {
      // NOTE: check permission
      const user = await gatekeeper.checkPermissions(
        request,
        'CREATE_RETAIL_PRODUCT',
        i18n,
        sellerId,
      );
      const { language } = getLanguage(request);

      // NOTE: validate input
      const newData = validateCreateNewProductInput(data);

      // NOTE: 1 - create product attributes & it's values
      const atts = restructureProductAttributes(newData.products);

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
      const newInfo =        '{ id name briefDescription catalog { id name } descriptions { retailer { id } description } brand { id brandName } products { id productMedias { id uri } productRetailers { id productName listPrice sellPrice stockQuantity inStock productMedias { id uri } retailer { id businessName } rating enabled approved createdAt updatedAt } options { id attribute { id name } value { id name} } sku } createdAt updatedAt }';

      const productTemplateData = {
        name: newData.name,
        briefDescription: newData.briefDescription,
        catalog: {
          connect: newData.catalogIds.map(id => ({ id })),
        },
        brand: {
          connect: {
            brandName: newData.brandName,
          },
        },
        descriptions: {
          create: {
            description: newData.detailDescription,
            retailer: {
              connect: {
                id: sellerId,
              },
            },
          },
        },
        products: {
          create: newData.products.map(product => ({
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
      };

      // NOTE: create product template
      const productTemplate = await prisma.mutation.createProductTemplate(
        { data: productTemplateData },
        newInfo,
      );

      // TODO: open support case for approval
      await prisma.mutation.createSupportCase({
        data: {
          subject: `Create: ${productTemplate.name}`,
          status: {
            connect: {
              name: 'OPEN',
            },
          },
          severity: {
            connect: {
              name: 'MEDIUM',
            },
          },
          catergory: {
            connect: {
              name: 'CREATE_PRODUCT_APPROVAL',
            },
          },
          openedByUser: {
            connect: {
              id: user.id,
            },
          },
          targetIds: productTemplate.products
            .map(product => product.productRetailers[0].id)
            .join(','),
        },
      });

      // NOTE: reconstruct to-be-returned object, more friendly
      const friendlyProduct = restrutureProductTemplate2FriendlyProduct(
        productTemplate,
      );

      return friendlyProduct;
    } catch (err) {
      logger.error(
        `ERROR_CREATE_BRANDNEW_PRODUCT_WITH_VARIANTS ${JSON.stringify(
          err,
          undefined,
          2,
        )}`,
      );
      const error = i18n._(t`Cannot create product`);
      throw new Error(error);
    }
  },

  // FIXME: a big misstake in this: update many products
  // TODO: open a support case for approval
  updateProducts: async (
    parent,
    { sellerId, data },
    {
 prisma, request, cache, i18n 
},
    info,
  ) => {
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      'UPDATE_RETAIL_PRODUCT',
      i18n,
      sellerId,
    );
    const { language } = getLanguage(request);

    // TODO: validate input
    const newData = validateUpdateProductInput(data);

    // NOTE: 1 - create product attributes & it's values
    const atts = restructureProductAttributes(newData);

    if (atts && atts.length > 0) {
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
    }

    const newInfo =      '{ id productName listPrice sellPrice stockQuantity inStock productMedias { id uri } product { productTemplate { id name briefDescription brand { id brandName } catalog { id name } descriptions { retailer { id } description } } options { attribute { name } value { name } } } rating enabled approved createdAt updatedAt }';

    // NOTE: 2 - update
    const updatedProducts = await Promise.all(
      newData.map(async product => {
        const currentMedias = await prisma.query.productRetailer(
          {
            where: {
              id: product.productId,
            },
          },
          '{ productMedias { id } }',
        );
        if (currentMedias) {
          await prisma.mutation.updateProductRetailer({
            where: {
              id: product.productId,
            },
            data: {
              productMedias: {
                disconnect: currentMedias.productMedias.map(id => id),
              },
            },
          });
        }

        // NOTE: attributes & value of given product are unchanged: update the given product
        const existedProduct = await prisma.query.productRetailers({
          where: {
            id: product.productId,
            product: product.attributes
              ? {
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
              }
              : undefined,
          },
        });

        if (existedProduct && existedProduct.length > 0) {
          return await prisma.mutation.updateProductRetailer(
            {
              where: {
                id: product.productId,
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
            newInfo,
          );
        }
        // NOTE: attributes of given product are changed -> delete given product and create the new one
        await prisma.mutation.deleteProductRetailer({
          where: {
            id: product.productId,
          },
        });
        return await prisma.mutation.createProductRetailer(
          {
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
          newInfo,
        );
      }),
    );

    return restructureProductRetailer2FriendlyProduct(updatedProducts);
  },

  toggleProductStatus: async (
    parent,
    { sellerId, productId },
    {
 prisma, request, cache, i18n 
},
    info,
  ) => {
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      'ONOFF_SELLABLE_RETAIL_PRODUCT',
      i18n,
      sellerId,
    );
    const { language } = getLanguage(request);

    const product = await prisma.query.productRetailer({
      where: {
        id: productId,
      },
    });

    if (!product) {
      const error = i18n._(t`Product not found`);
      throw new Error(error);
    }

    const newInfo =      '{ id productName listPrice sellPrice stockQuantity product { productTemplate { id name briefDescription catalog { id name } brand { id brandName } descriptions { retailer { id } description } } options { attribute { name } value { name } } } inStock productMedias { id uri } rating enabled approved createdAt updatedAt }';

    const updatedProduct = await prisma.mutation.updateProductRetailer(
      {
        where: {
          id: productId,
        },
        data: {
          enabled: !product.enabled,
        },
      },
      newInfo,
    );

    const friendlyProduct = restructureProductRetailer2FriendlyProduct([
      updatedProduct,
    ]).pop();

    return friendlyProduct;
  },
};
