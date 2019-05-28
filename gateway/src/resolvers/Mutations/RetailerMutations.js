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

    await prisma.mutation.createRetailer({
      data: retailerData,
    });

    const updatedUser = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      "{ id name profile profileMedia { id uri } badgeMedias {id uri } addresses { id description region name phone street unit district city state zip } email phone password enabled recoverable assignment { id retailers { id businessName businessEmail businessPhone businessAddress { id description region name phone street unit district city state zip } businessMedia { id uri } businessLicense enabled createdAt updatedAt } } createdAt updatedAt }",
    );

    return {
      userId: updatedUser.id,
      userProfile: {
        id: updatedUser.id,
        name: updatedUser.name,
        profile: updatedUser.profile,
        profileMedia: updatedUser.profileMedia,
        badgeMedias: updatedUser.badgeMedias,
        addresses: updatedUser.addresses,
        email: updatedUser.email,
        phone: updatedUser.phone,
        password: updatedUser.password,
        enabled: updatedUser.enabled,
        recoverable: updatedUser.recoverable,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        assignment: {
          id: updatedUser.assignment ? updatedUser.assignment.id : undefined,
          user: updatedUser,
          retailers: updatedUser.assignment ? updatedUser.assignment.retailers : undefined,
        },
      },
    };
  },
};
