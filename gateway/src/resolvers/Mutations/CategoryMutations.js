// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";

export const Mutation = {
  createCategory: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    // TODO: Check permission

    const category = prisma.query.category({
      where: {
        OR: [{ id: data.name }, { name: data.name }],
      },
    });
    if (category) {
      const error = i18n._(t`Category is existed`);
      throw new Error(error);
    }

    return prisma.mutation.createCategory(
      {
        data,
      },
      info,
    );
  },

  updateCategory: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    const category = prisma.query.category({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
    if (!category) {
      const error = i18n._(t`Category is not found`);
      throw new Error(error);
    }

    return prisma.mutation.updateCategory({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
  },

  deleteCategory: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    const category = prisma.query.category({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
    if (!category) {
      const error = i18n._(t`Category is not found`);
      throw new Error(`Category is not found`);
    }
  },
};
