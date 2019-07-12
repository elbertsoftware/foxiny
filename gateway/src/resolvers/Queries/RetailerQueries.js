// @flow

import { getUserIDFromRequest } from "../../utils/authentication";
import logger from "../../utils/logger";

// TODO: optimize queries for pagination and searching

export const Query = {
  retailers: (parent, { query }, { prisma, request, i18n }, info) => {
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [{ id: query }, { businessName: query }, { phone: query }],
      };
    }

    return prisma.query.retailers(opArgs, info);
  },

  myRetailers: async (parent, { query }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    const opArgs = {
      where: {
        AND: [
          {
            owner_some: {
              user: {
                id: userId,
              },
            },
          },
        ],
      },
    };

    if (query) {
      opArgs.where.AND.push({
        OR: [{ id: query }, { businessName: query }, { phone: query }],
      });
    }

    return prisma.query.retailers(opArgs, info);
  },
};
