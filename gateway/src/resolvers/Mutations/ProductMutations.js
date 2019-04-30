// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest, checkRights } from "../../utils/authentication";

export const Mutation = {
  createBrandNewProductWVariants: async (parent, { sellerId, data }, { prisma, request, cache }, info) => {
    // TODO: check permission
    // TODO: validate input

    // NOTE: fragment ensure description always be returned, lack of manufacturer!!!
    const fragment = `fragment ProDetails on Product { id name briefDescription category { id name } descriptions { retailer { id } description } brand { id brandName } variants { id productMedias { uri } productRetailers { listPrice sellPrice stockQuantity inStock productMedias { uri } retailer { id businessName } rating approved } option_1 { id anme } option_1_value { id name } option_2 { id name } option_2_value { id name } sku } }`;

    const product = {
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
      variants: {
        create: data.variants.map(variant => ({
          // sku:  TODO: generate SKU code here
          productRetailers: {
            create: {
              listPrice: variant.listPrice,
              sellPrice: variant.sellPrice,
              stockQuantity: variant.stockQuantity,
              retailer: {
                connect: {
                  id: sellerId,
                },
              },
            },
          },
          option_1: {
            connect: {
              id: variant.option_1_Id,
            },
          },
          option_1_value: {
            connect: {
              id: variant.option_1_value,
            },
          },
          option_2: {
            connect: {
              id: variant.option_2_Id,
            },
          },
          option_2_value: {
            connect: {
              id: variant.option_2_value,
            },
          },
        })),
      },
      brand: {
        connect: {
          id: data.brandId,
        },
      },
    };

    return await prisma.mutation.createProduct({ data: product }, fragment);
  },

  createVariantType: async (parent, { data }, { prisma, request, cache }, info) => {
    // TODO: check permission
    // TODO: validate input

    const variants = await Promise.all(
      data.map(async variant => {
        return prisma.mutation.createVariant(
          {
            data: variant,
          },
          info,
        );
      }),
    );
    return variants;
  },
};
