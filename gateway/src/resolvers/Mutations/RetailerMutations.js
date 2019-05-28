// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";

export const Mutation = {
  registerRetailer: async (parent, { data }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // TODO: validate input
    // TODO: validate address

    const retailerData = {
      businessName: data.businessName,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      businessAddress: {
        create: data.businessAddress,
      },
      enabled: true,
      owner: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    };

    return prisma.mutation.createRetailer({
      data: retailerData,
    });
  },
};
