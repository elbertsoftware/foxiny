// @flow

import { getUserIDFromRequest } from '../utils/authentication';

const Query = {
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

    return prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      info,
    );
  },

  // get all security questions
  securityQuestions: async (parent, args, { prisma, request, cache }, info) => {
    return prisma.query.securityQuestions(null, info);
  },

  avatars: async (parent, args, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    // get all avatars (uploaded by user)
    const avatars = await prisma.query.userAvatars({
      where: {
        user: {
          id: userId,
        },
      },
    });

    // always include default avatar to final result
    // this does not exist in database
    const defaultAvatar = {
      id: 'default',
      url: 'user.sgv',
      enabled: !avatars.some(x => x.enabled),
    };

    avatars.push(defaultAvatar);

    return avatars;
  },
};

export default Query;
