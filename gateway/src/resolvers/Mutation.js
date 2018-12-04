// @flow

import { hashPassword, verifyPassword, generateToken, getUserId } from '../utils/authentication';

const Mutation = {
  createUser: async (parent, { data }, { prisma }) => {
    const password = hashPassword(data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password, // replace plain text password with the hashed one
      },
    });
    // }, info); // can not use info here since we are returning custom type AuthPayload

    return {
      user,
      token: generateToken(user.id),
    };
  },

  login: async (parent, { data }, { prisma }) => {
    const user = await prisma.query.user({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error('Unable to login'); // try NOT to provide enough information so hackers can guess
    }

    const matched = verifyPassword(data.password, user.password);
    if (!matched) {
      throw new Error('Unable to login'); // try NOT to provide enough information so hackers can guess
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },

  updateUser: (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request);

    const updateData = { ...data };

    // TODO: For user account recovery purpose, sensitive info like email, password, etc. need to be archived
    if (typeof data.email === 'string') {
      // email is about to be changed
      // TODO: Archive current email somewhere else
    }

    if (typeof data.password === 'string') {
      // password is about to be changed
      // TODO: Archive current password somewhere else
      updateData.password = hashPassword(data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: updateData,
      },
      info,
    );
  },

  deleteUser: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info,
    );
  },
};

export default Mutation;
