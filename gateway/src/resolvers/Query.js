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

  meSecurityInfo: async (parent, args, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const query = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      '{ securityAnswers { id securityQuestion { id question } answer createdAt updatedAt } }',
    );

    // cast to type SecurityInfo
    return query.securityAnswers.map(item => ({
      questionId: item.securityQuestion.id,
      question: item.securityQuestion.question,
      answerId: item.id,
      answer: item.answer,
    }));
  },

  // get all security questions
  securityQuestions: async (parent, args, { prisma, request, cache }, info) => {
    return prisma.query.securityQuestions(null, info);
  },
};

export default Query;
