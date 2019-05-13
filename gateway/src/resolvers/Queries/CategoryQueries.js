// @flow

import logger from '../../utils/logger';

export const Query = {
  categories: (parent, { query }, { prisma, request }, info) => {
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
        ],
      };
    }

    return prisma.query.categories(opArgs, info);
  },

  brands: (parent, { query }, { prisma, request }, info) => {
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
        ],
      };
    }

    return prisma.query.brands(opArgs, info);
  },
};
