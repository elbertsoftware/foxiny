// @flow

import logger from "../../utils/logger";
import { addFragmentToInfo } from "graphql-binding";
import { getLanguage } from "../../utils/i18nHelper";
import {
  restructureCatalog,
  resturectureBrand,
} from "../../utils/catalogUtils/dataHelper";

export const Query = {
  catalogs: async (parent, { query }, { prisma, request, i18n }, info) => {
    const { language } = getLanguage(request);
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            id_contains: query,
          },
          {
            name_contains: query,
          },
          {
            trans_name_some: {
              name_contains: query,
            },
          },
        ],
      };
    }

    const fragment =
      "{ id name parentId { id } children { id } trans_name { language { languageCode } name } createdAt updatedAt }";
    const catalog = await prisma.query.catalogs(
      opArgs,
      // fragment,
      addFragmentToInfo(info, fragment),
    );
    const friendlyCatalog = restructureCatalog(catalog, language);

    return friendlyCatalog;
  },

  brands: async (parent, { query }, { prisma, request, i18n }, info) => {
    const { language } = getLanguage(request);
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            id_contains: query,
          },
          {
            brandName_contains: query,
          },
          {
            trans_name_some: {
              brandName_contains: query,
            },
          },
        ],
      };
    }

    const fragment =
      "{ id name parentId { id } trans_brandName { language { languageCode } brandName } createdAt updatedAt }";
    const brands = await prisma.query.brands(
      opArgs,
      // fragment,
      addFragmentToInfo(info, fragment),
    );
    console.log(JSON.stringify(brands, undefined, 2));
    const friendlyBrand = resturectureBrand(brands, language);

    return friendlyBrand;
  },
};
