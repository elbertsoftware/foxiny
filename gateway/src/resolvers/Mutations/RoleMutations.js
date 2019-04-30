// @flow

import logger from '../../utils/logger';
import { getUserIDFromRequest } from '../../utils/authentication';

export const Mutation = {
  createPermission: async (parent, { data }, { prisma, request, cache }, info) => {
    const userId = getUserIDFromRequest(request, cache);
    const user = await prisma.query.user({ where: { id: userId } });

    // TODO: check permission
    if (!user) {
      throw new Error(`Access is denied`);
    }

    // TODO: validate input

    return await prisma.mutation.createRetailer(
      {
        data: {
          ...data,
          enabled: true,
        },
      },
      info,
    );
  },
  updatePermission: async (parent, { data }, { prisma, request, cache }, info) => {},
};
