// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";

export const Mutation = {
  createCatalog: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    // TODO: Check permission

    const catalog = prisma.query.Catalog({
      where: {
        OR: [{ id: data.name }, { name: data.name }],
      },
    });
    if (catalog) {
      const error = i18n._(t`Catalog is existed`);
      throw new Error(error);
    }

    return prisma.mutation.createCatalog(
      {
        data,
      },
      info,
    );
  },

  updateCatalog: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    const catalog = prisma.query.Catalog({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
    if (!catalog) {
      const error = i18n._(t`Catalog is not found`);
      throw new Error(error);
    }

    return prisma.mutation.updateCatalog({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
  },

  deleteCatalog: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    const catalog = prisma.query.Catalog({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
    if (!catalog) {
      const error = i18n._(t`Catalog is not found`);
      throw new Error(`Catalog is not found`);
    }
  },
};
