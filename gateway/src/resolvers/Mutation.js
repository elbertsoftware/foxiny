// @flow

import {
  hashPassword,
  verifyPassword,
  generateToken,
  terminateToken,
  terminateAllTokens,
  getToken,
  getUserId,
} from '../utils/authentication';

const Mutation = {
  createUser: async (parent, { data }, { prisma, request, cache }) => {
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
      token: generateToken(user.id, request, cache),
    };
  },

  login: async (parent, { data }, { prisma, request, cache }) => {
    const user = await prisma.query.user({
      where: {
        email: data.email,
        phone: data.phone,
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
      token: generateToken(user.id, request, cache),
    };
  },

  logout: async (parent, { all }, { request, cache }) => {
    const token = getToken(request);
    const userId = getUserId(request, cache);
    if (all) {
      terminateAllTokens(userId);
    } else {
      terminateToken(userId, token);
    }

    return userId;
  },

  updateUser: (parent, { data }, { prisma, request, cache }, info) => {
    const userId = getUserId(request, cache);

    const updateData = { ...data };

    // TODO: For user account recovery purpose, sensitive info like email, phone, password, etc. need to be archived
    if (typeof data.email === 'string') {
      // email is about to be changed
      // TODO: Archive current email somewhere else
    }

    if (typeof data.phone === 'string') {
      // phone is about to be changed
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

  deleteUser: (parent, args, { prisma, request, cache }, info) => {
    const userId = getUserId(request, cache);

    terminateToken(userId);
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
