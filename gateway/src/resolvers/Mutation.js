// @flow

import { addFragmentToInfo } from 'graphql-binding';

import {
  hashPassword,
  verifyPassword,
  generateConfirmation,
  verifyConfirmation,
  generateToken,
  deleteTokenInCache,
  deleteAllTokensInCache,
  getTokenFromRequest,
  getUserIDFromRequest,
} from '../utils/authentication';

import logger from '../utils/logger';
import { sendConfirmationEmail } from '../utils/email';
import { sendConfirmationText } from '../utils/sms';

const Mutation = {
  createUser: async (parent, { data }, { prisma, cache }, info) => {
    const password = hashPassword(data.password);

    const user = await prisma.mutation.createUser(
      {
        data: {
          ...data,
          password, // replace plain text password with the hashed one
          enabled: false, // user needs to confirm before the account become enabled
        },
      },
      info,
    );

    const code = generateConfirmation(cache, user.id);

    // email the code if user is signing up via email
    if (typeof data.email === 'string') {
      sendConfirmationEmail(data.name, data.email, code);
    }

    // text the code if user is signing up via phone
    if (typeof data.phone === 'string') {
      sendConfirmationText(data.name, data.phone, code);
    }

    return user;
  },

  resendConfirmation: async (parent, { userId }, { prisma, cache }, info) => {
    const fragment = 'fragment userNameEmailPhoneEnabled on User { name email phone enabled }';
    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      addFragmentToInfo(info, fragment),
    );

    if (!user) {
      throw new Error('Unable to resend confirmation'); // try NOT to provide enough information so hackers can guess
    }

    logger.debug(
      `user id ${userId}, name ${user.name}, email ${user.email}, password ${user.phone}, enabled ${user.enabled}`,
    );

    if (user.enabled) {
      throw new Error('User profile has been confirmed');
    }

    const code = generateConfirmation(cache, userId);

    // email the code if user is signing up via email
    if (typeof user.email === 'string') {
      sendConfirmationEmail(user.name, user.email, code);
    }

    // text the code if user is signing up via phone
    if (typeof user.phone === 'string') {
      sendConfirmationText(user.name, user.phone, code);
    }

    return user;
  },

  confirmUser: async (parent, { data }, { prisma, cache }, info) => {
    const matched = await verifyConfirmation(cache, data.code, data.userId);
    logger.debug(`confirmation matched: ${matched}`);
    if (!matched) {
      throw new Error('Unable to confirm user profile');
    }

    const user = prisma.mutation.updateUser(
      {
        where: {
          id: data.userId,
        },
        data: {
          enabled: true,
        },
      },
      info,
    );

    return user;
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

    if (!user.enabled) {
      throw new Error('User profile has not been confirmed or was disabled');
    }

    const matched = verifyPassword(data.password, user.password);
    if (!matched) {
      throw new Error('Unable to login'); // try NOT to provide enough information so hackers can guess
    }

    return {
      token: generateToken(user.id, request, cache),
      user,
    };
  },

  logout: async (parent, { all }, { request, cache }) => {
    const token = getTokenFromRequest(request);
    const userId = await getUserIDFromRequest(request, cache);
    if (all) {
      deleteAllTokensInCache(cache, userId);
    } else {
      deleteTokenInCache(cache, userId, token);
    }

    return {
      token,
      userId,
    };
  },

  updateUser: async (parent, { data }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const { password, currentPassword } = data;
    delete data.password;
    delete data.currentPassword;

    const updateData = { ...data };

    // TODO: For user account recovery purpose, sensitive info like email, phone, password, etc. need to be archived

    // email is about to be changed
    if (typeof data.email === 'string') {
      updateData.enabled = false;

      // TODO: Archive current email somewhere else
    }

    // phone is about to be changed
    if (typeof data.phone === 'string') {
      updateData.enabled = false;

      // TODO: Archive current phone somewhere else
    }

    // both password and currentPassword present which means password is about to be changed
    if (typeof password === 'string' && typeof currentPassword === 'string') {
      // verify current password
      const user = await prisma.query.user({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error('Unable to update user profile'); // try NOT to provide enough information so hackers can guess
      }

      const matched = verifyPassword(currentPassword, user.password);
      if (!matched) {
        throw new Error('Unable to update user profile'); // try NOT to provide enough information so hackers can guess
      }

      updateData.password = hashPassword(password);
      deleteAllTokensInCache(cache, userId);

      // TODO: Archive current password somewhere else
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

  deleteUser: async (parent, args, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    deleteAllTokensInCache(cache, userId);
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
