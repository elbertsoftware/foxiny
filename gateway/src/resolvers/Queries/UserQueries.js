// @flow

import { getUserIDFromRequest } from "../../utils/authentication";
import logger from "../../utils/logger";

export const Query = {
  users: (parent, args, { prisma, request }, info) => {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          // use OR to search for multiple fields
          {
            name_contains: args.query,
          }, // ,
          // {
          // locked down email search, uncomment this block if need to search on other fields
          //  email_contains: args.query,
          // },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
  },

  me: async (parent, args, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      info,
    );

    return user;
  },

  // get all security questions
  securityQuestions: async (parent, args, { prisma, request, cache }, info) => {
    return prisma.query.securityQuestions(null, info);
  },

  meAssignments: async (parent, args, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const userAssignment = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      // `{ assignment { id retailers { id } manufacturers { id }} }`
      `{ assignment { id retailers { id } } }`,
    );
    return (meAssigns = {
      retailerIds: userAssignment.retailers ? userAssignment.retailers.map(retailer => retailer.id) : [],
      manufacturerIds: userAssignment.manufacturers ? userAssignment.manufacturers.map(manu => manu.id) : [],
    });
  },
};
