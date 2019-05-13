// @flow

import logger from '../../utils/logger';

export const Mutation = {
  createCategory: async (parent, { data }, { prisma, cache, request }, info) => {
    // TODO: Check permission

    const category = prisma.query.category({
      where: {
        OR: [{ id: data.name }, { name: data.name }],
      },
    });
    if (category) {
      throw new Error(`Category is existed`);
    }

    return prisma.mutation.createCategory(
      {
        data,
      },
      info,
    );
  },

  updateCategory: async (parent, { data }, { prisma, cache, request }, info) => {
    const category = prisma.query.category({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
    if (!category) {
      throw new Error(`Category is not found`);
    }

    return prisma.mutation.updateCategory({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
  },

  deleteCategory: async (parent, { data }, { prisma, cache, request }, info) => {
    const category = prisma.query.category({
      where: {
        OR: [{ id: data.id }, { name: data.oldName }],
      },
    });
    if (!category) {
      throw new Error(`Category is not found`);
    }
  },
};
