// @flow

import logger from '../../utils/logger';

export const Query = {
  products: (parent, { query }, { prisma, request }, info) => {
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
            description_contains: query,
          },
        ],
      };
    }

    return prisma.query.products(opArgs, info);
  },
};
