// @flow

import { addFragmentToInfo } from 'graphql-binding';
import bcrypt from 'bcryptjs';
import cryptoRandomString from 'crypto-random-string';

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
import {
  validateCreateInput,
  validateConfirmInput,
  validateSecurityInfo,
  validateResendConfirmationInput,
  validateUpdateInput,
  validateResetPwdInput,
  removeEmptyProperty,
} from '../utils/validation';
import logger from '../utils/logger';
import { sendConfirmationEmail } from '../utils/email';
import { sendConfirmationText } from '../utils/sms';
import { sendConfirmationEsms } from '../utils/smsVN';

// TODO: un-comment sendConfirmation functions

const Mutation = {
  createUser: async (parent, { data }, { prisma, cache, request }, info) => {
    validateCreateInput(data);

    const password = hashPassword(data.password);
    const user = await prisma.mutation.createUser(
      {
        data: {
          ...data,
          password, // replace plain text password with the hashed one
          enabled: false, // user needs to confirm before the account become enabled
        },
      },
    });

    const code = generateConfirmation(cache, user.id);

    // email the code if user is signing up via email
    if (typeof data.email === 'string') {
      // sendConfirmationEmail(data.name, data.email, code);
      if (process.env.TEST_STATE) {
        // TODO: try to count how many time confirmation code is sent to user and
        // try to stop sending to many times
      }
    }

    // text the code if user is signing up via phone
    if (typeof data.phone === 'string') {
      // TODO: try to find out where does the number come from, US or VN or other, to choose the best way to send the code
      // sendConfirmationText(data.name, data.phone, code);
      // sendConfirmationEsms(user.phone, code);
      if (process.env.TEST_STATE) {
        // TODO: try to count how many time confirmation code is sent to user and
        // try to stop sending to many times
      }
    }

    return user;
  },

  /**
   * Insert or update user's security info
   */
  upsertSecurityInfo: async (parent, { securityInfo }, { prisma, cache, request }, info) => {
    validateSecurityInfo(securityInfo);

    const userId = await getUserIDFromRequest(request, cache);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.info(`🛑 CREATE_SECURITY_INFO: User ${data.userId} not found`);
      throw new Error('Unable to confirmUser'); // try NOT to provide enough information so hackers can guess
    }

    // insert new question and restructure to-be-inserted data
    const updateData = [];
    for (let i = 0; i < 3; i++) {
      if (securityInfo[i].questionId) {
        updateData.push({
          questionId: securityInfo[i].questionId,
          answer: securityInfo[i].answer,
        });
      } else {
        const question = await prisma.mutation.createSecurityQuestion({
          data: {
            question: securityInfo[i].question,
          },
        });
        updateData.push({
          questionId: question.id,
          answer: securityInfo[i].answer,
        });
      }
    }

    // create new securityInfo to user
    const updatedUser = await prisma.mutation.updateUser({
      where: {
        id: userId,
      },
      data: {
        securityAnswers: {
          deleteMany: {
            createdAt_lt: new Date(),
          },
          // cast Question&AnswerPairs from input to securityAnswer before mutating
          create: updateData.map(pair => ({
            securityQuestion: {
              connect: {
                id: pair.questionId,
              },
            },
            answer: pair.answer,
          })),
        },
        recoverable: true,
      },
      info,
    });

    return updatedUser;
  },

  // TODO: how does it work if user want to confirm account but has no userId --> solved
  confirmUser: async (parent, { data }, { prisma, cache }, info) => {
    validateConfirmInput(data);

    const user = await prisma.query.user({
      where: {
        id: data.userId,
        email: data.email,
        phone: data.phone,
      },
    });

    if (!user) {
      logger.info(`🛑 CONFIRM_USER: User ${data.userId}${data.email}${data.phone} not found`);
      throw new Error('Unable to confirmUser'); // try NOT to provide enough information so hackers can guess
    }

    const matched = await verifyConfirmation(cache, data.code, data.userId || user.id);
    logger.debug(`confirmation matched: ${matched}`);
    if (!matched) {
      throw new Error('Unable to confirm user profile');
    }

    // change to true on matched input
    const updateData = {
      enabled: true,
      emailConfirmed: (data.userId || data.email) && !!user.email,
      phoneConfirmed: (data.userId || data.phone) && !!user.phone,
    };

    const updatedUser = await prisma.mutation.updateUser(
      {
        where: {
          id: user.id,
        },
        data: updateData,
      },
      info,
    );

    return updatedUser;
  },

  // reusing this to confirm additional phone/email, or the code is expired/invalid
  resendConfirmation: async (parent, { data }, { prisma, cache }, info) => {
    validateResendConfirmationInput(data);

    const user = await prisma.query.user({
      where: {
        id: data.userId,
        email: data.email,
        phone: data.phone,
      },
    });

    if (!user) {
      throw new Error('Unable to resend confirmation'); // try NOT to provide enough information so hackers can guess
    }

    logger.debug(
      `user id ${user.id}, name ${user.name}, email ${user.email}, password ${user.phone}, emailConfirmed ${
        user.emailConfirmed
      }, phoneConfirmed ${user.phoneConfirmed}, enabled ${user.enabled}`,
    );

    if (user.enabled && ((user.emailConfirmed && data.email) || (user.phoneConfirmed && data.phone))) {
      throw new Error('User profile has been confirmed');
    }

    const code = generateConfirmation(cache, user.id);

    // email the code if user is signing up via email
    if (typeof user.email === 'string' && (data.userId || data.email) && !user.emailConfirmed) {
      // sendConfirmationEmail(user.name, user.email, code);
      logger.debug('Email resent');
    }

    // text the code if user is signing up via phone
    if (typeof user.phone === 'string' && (data.userId || data.phone) && !user.phoneConfirmed) {
      // sendConfirmationText(user.name, user.phone, code);
      // sendConfirmationEsms(user.phone, code);
      logger.debug('Phone resent');
    }

    return true;
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

    validateUpdateInput(data);

    const { password, currentPassword } = data;
    delete data.password;
    delete data.currentPassword;

    const updateData = { ...data };

    // TODO: For user account recovery purpose, sensitive info like email, phone, password, etc. need to be archived

    try {
      let canUpdate = false;
      if (currentPassword) {
        // verify current password
        const user = await prisma.query.user(
          {
            where: {
              id: userId,
            },
          },
          '{ id name email phone password }',
        );

        canUpdate = verifyPassword(currentPassword, user.password);
        if (!canUpdate) {
          throw new Error('Unable to update user profile'); // try NOT to provide enough information so hackers can guess
        }
      }

      // email is about to be changed
      if (typeof data.email === 'string' && canUpdate) {
        updateData.enabled = false;

        // TODO: Archive current email somewhere else
      }

      // phone is about to be changed
      if (typeof data.phone === 'string' && canUpdate) {
        updateData.enabled = false;

        // TODO: Archive current phone somewhere else
      }

      // both password and currentPassword present which means password is about to be changed
      if (typeof password === 'string' && typeof currentPassword === 'string' && canUpdate) {
        updateData.password = hashPassword(password);

        // TODO: Archive current password somewhere else
      }

      // TODO: Should clean all token after email/phone/pwd changed?
      // deleteAllTokensInCache(cache, userId);

      const updatedUser = prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: updateData,
        },
        info,
      );

      return updatedUser;
    } catch (error) {
      logger.info(`🛑 UPDATE_USER ${error}`);
      throw new Error('Unable to update user profile'); // try NOT to provide enough information so hackers can guess
    }
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

  // Step1: user click forgot pwd -> return security questions
  requestResetPwd: async (parent, { data }, { prisma, request, cache }, info) => {
    const user = await prisma.query.user(
      {
        where: {
          email: data.email,
          phone: data.phone,
        },
      },
      `{ id securityAnswers { securityQuestion { id question } } enabled}`,
    );

    if (!user) {
      throw new Error('Account does not exist'); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      throw new Error('Account has not been confirmed or was disabled');
    }

    // log out of all devices
    deleteAllTokensInCache(cache, user.id);

    return {
      token: generateToken(user.id, request, cache),
      securityQuestions: user.securityAnswers.map(question => ({
        id: question.securityQuestion.id,
        question: question.securityQuestion.question,
      })),
    };
  },

  // Step2: user enter the answers and new password
  resetPassword: async (parent, { data }, { prisma, request, cache }, info) => {
    validateResetPwdInput(data);
    const userId = await getUserIDFromRequest(request, cache);
    if (!userId) throw new Error('null userid');
    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      `{ id securityAnswers { securityQuestion { id question } answer } enabled}`,
    );

    if (!user) {
      throw new Error('Unable to perform reset password request'); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      throw new Error('User profile has not been confirmed or was disabled');
    }

    const { securityAnswers } = user;
    const { securityInfo } = data;

    const flag =
      securityInfo[0].answer.toLowerCase() ===
        securityAnswers.find(x => x.securityQuestion.id === securityInfo[0].questionId).answer.toLowerCase() &&
      securityInfo[1].answer.toLowerCase() ===
        securityAnswers.find(x => x.securityQuestion.id === securityInfo[1].questionId).answer.toLowerCase() &&
      securityInfo[2].answer.toLowerCase() ===
        securityAnswers.find(x => x.securityQuestion.id === securityInfo[2].questionId).answer.toLowerCase() &&
      securityInfo.length === 3;

    // TODO: after x tries, prevent user from trying to recover account in y minutes

    // change pwd if account is verified
    if (flag) {
      const updateUser = {
        password: hashPassword(data.password),
      };

      // remove all tokens from cache
      deleteAllTokensInCache(cache, userId);

      // update user's new pwd
      const updatedUser = await prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: updateUser,
        },
        '{ password }',
      );

      return verifyPassword(data.password, updatedUser.password);
    }

    throw new Error('Unable to perform reset password request');
  },
};

export default Mutation;
