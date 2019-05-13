// @flow

import logger from '../../utils/logger';
import { getUserIDFromRequest } from '../../utils/authentication';

export const Mutation = {
  createManufacturer: async (parent, { data }, { prisma, request, cache }, info) => {
    const userId = getUserIDFromRequest(request, cache);
    const user = await prisma.query.user({ where: { id: userId } });

    // TODO: check permission
    if (!user) {
      throw new Error(`Access is denied`);
    }

    // TODO: validate input
    const arg = {
      assistants: {
        connect: data.assistants.map(id => ({ id: id })),
      },
      businessName: data.businessName,
      address: {
        create: { data: data.address },
      },
      phone: data.phone,
    };

    return await prisma.mutation.createManufacturer(
      {
        data: arg,
      },
      info,
    );
  },
};
