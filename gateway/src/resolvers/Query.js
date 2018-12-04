// @flow

import { getUserId } from '../utils/authentication';

const Query = {
  users: (parent, args, { prisma }, info) => {
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

  me: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request);

    return prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      info,
    );
  },
};

export default Query;
