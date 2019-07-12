// @flow

import { t } from '@lingui/macro';
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
  cleanToken,
} from '../../utils/authentication';
import {
  validateCreateInput,
  validateConfirmInput,
  validateSecurityInfo,
  validateResendConfirmationInput,
  validateUpdateInput,
  validateResetPwdInput,
  classifyEmailPhone,
} from '../../utils/validation';
import logger from '../../utils/logger';
import { sendConfirmationEmail } from '../../utils/email';
import { sendConfirmationText } from '../../utils/sms';
import { sendConfirmationEsms } from '../../utils/smsVN';
import { gatekeeper } from '../../utils/permissionChecker';

// TODO: un-comment sendConfirmation
// NOTE: handling errors in a frendly way: https://www.youtube.com/watch?v=fUq1iHiDniY
// NOTE: almost of data input will be validated, trimmed and normalized
// TODO: check and assign roles/permissions

export const Mutation = {
  /**
   * Create user
   * user must enter: name, email or phone and pwd
   */
  createUser: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    let newData;
    try {
      newData = validateCreateInput(data, i18n);
    } catch (err) {
      logger.error(`🛑❌  Cannot create user ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const password = hashPassword(newData.password);
    const user = await prisma.mutation.createUser(
      {
        data: {
          ...newData,
          password, // replace plain text password with the hashed one
          enabled: false, // user needs to confirm before the account become enabled
          assignment: {
            create: {
              roles: {
                connect: {
                  name: 'USER',
                },
              },
            },
          },
        },
      },
      info,
    );

    // for transact-log
    logger.info(
      `CREATE_USER | 1 | ${newData.name} | ${newData.email || undefined} | ${newData.phone || undefined} | ${
        newData.password
      }`,
    );

    const code = generateConfirmation(cache, user.id, newData.email || newData.phone);

    // email the code if user is signing up via email
    if (typeof newData.email === 'string') {
      // sendConfirmationEmail(newData.name, newData.email, code);
    }

    // text the code if user is signing up via phone
    if (typeof newData.phone === 'string') {
      // TODO: try to find out where does the number come from, US or VN or other, and choose the best way to send the code
      // sendConfirmationText(newData.name, newData.phone, code);
      // sendConfirmationEsms(newData.name, newData.phone, code);
    }

    return user;
  },

  /**
   * Confirm user
   * Confirm email or phone
   */
  confirmUser: async (parent, { data }, { prisma, cache, i18n }, info) => {
    let newData;
    try {
      newData = validateConfirmInput(data);
    } catch (err) {
      logger.error(`🛑❌  Cannot create user ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const user = await prisma.query.user({
      where: {
        id: newData.userId,
        email: newData.email,
        phone: newData.phone,
      },
    });

    if (!user) {
      logger.debug(
        `🛑❌  CONFIRM_USER: User ${
          newData.userId ? newData.userId : newData.email ? newData.email : newData.phone
        } not found`,
      );
      const error = i18n._(t`Unable to confirm user`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    // NOTE: matched contains email or phone
    const matched = await verifyConfirmation(cache, newData.code, user.id, i18n);
    logger.debug(`confirmation matched: ${matched}`);
    if (!matched) {
      const error = i18n._(t`Unable to confirm user`);
      throw new Error(error);
    }

    // change enabled to true when matched is true
    const updateData = classifyEmailPhone(matched);
    updateData.enabled = true;

    await prisma.mutation.updateUser({
      where: {
        id: user.id,
      },
      data: updateData,
    });

    // for transact-log
    logger.info(`UPDATE_USER | 1 | ${user.id} | ${updateData.email || undefined} | ${updateData.phone}`);

    return true;
  },

  /**
   * Insert or update user's security info
   */
  upsertSecurityInfo: async (parent, { securityInfo }, { prisma, cache, request, i18n }, info) => {
    let newData;
    try {
      newData = validateSecurityInfo(securityInfo);
    } catch (err) {
      logger.error(`🛑❌  Cannot create user ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    // NOTE: check permissions
    const user = await gatekeeper.checkPermissions(request, 'USER', i18n);

    // const user = await prisma.query.user({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   logger.debug(`🛑❌  CREATE_SECURITY_INFO: User ${userId} not found`);
    //   const error = i18n._(t`Unable to update user`);
    //   throw new Error(error); // try NOT to provide enough information so hackers can guess
    // }

    // NOTE: insert new question (if user enters) and create to-be-updated data
    const updateData = [];
    for (let i = 0; i < 3; i++) {
      // if question is existed in db, just re-use the question id
      if (newData[i].questionId) {
        updateData.push({
          questionId: newData[i].questionId,
          answer: newData[i].answer,
        });
      } else {
        // else insert the new one to db and get its question id
        const question = await prisma.mutation.createSecurityQuestion({
          data: {
            question: newData[i].question,
          },
        });

        // for transact-log
        logger.info(`CREATE_SECQUES | 1 | ${newData[i].question}`);

        updateData.push({
          questionId: question.id,
          answer: newData[i].answer,
        });
      }
    }

    // NOTE: delete old securityInfo and insert the new one
    const updatedUser = await prisma.mutation.updateUser({
      where: {
        id: user.id,
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

    // for transact-log
    logger.info(
      `UPSERT_SECINFO | 1 | ${user.id} | ${updateData[0].questionId} | ${updateData[0].answer} | ${
        updateData[1].questionId
      } | ${updateData[1].answer} | ${updateData[2].questionId} | ${updateData[2].answer}`,
    );

    return updatedUser;
  },

  /**
   * Resend confirmation
   * using this to send a confirmation code to phone or email
   */
  resendConfirmation: async (parent, { data }, { prisma, cache, request, i18n }, info) => {
    // TODO: check ip before perform this mutation, prevent that ip sends tons of requests

    // NOTE: (for client) one of three: userId, email and phone is accepted only
    let newData;
    try {
      newData = validateResendConfirmationInput(data);
    } catch (err) {
      logger.error(`🛑❌  Cannot create user ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const user = await gatekeeper.checkPermissions(request, 'USER', i18n);

    // const user = await prisma.query.user({
    //   where: {
    //     id: newData.userId || userId,
    //     email: newData.email,
    //     phone: newData.phone,
    //   },
    // });

    // if (!user) {
    //   const error = i18n._(t`Unable to resend confirmation`);
    //   throw new Error(error); // try NOT to provide enough information so hackers can guess
    // }

    logger.debug(
      `user id ${user.id}, name ${user.name}, email ${user.email}, password ${user.phone}, enabled ${user.enabled}`,
    );

    if (user.enabled && (newData.email === user.email || newData.phone === user.phone)) {
      const error = i18n._(t`User has been confirmed`);
      throw new Error(error);
    }

    const code = generateConfirmation(cache, user.id, newData.email || newData.phone || user.email || user.phone);

    // case: user updates info and confirm new info
    // case: user wants to confirm account after signed up but not confirmed yet (disconnect or ST else)
    if (user.enabled) {
      if (typeof newData.email === 'string') {
        // sendConfirmationEmail(user.name, newData.email, code);
        logger.debug('Email resent');
      }

      // text the code if user is signing up via phone
      if (typeof newData.phone === 'string') {
        // sendConfirmationText(user.name, newData.phone, code);
        // sendConfirmationEsms(user.name, newData.phone, code);
        logger.debug('Phone resent');
      }
      return true;
    }

    // email the code if user is signing up via email
    if (typeof user.email === 'string') {
      // sendConfirmationEmail(user.name, user.email, code);
      logger.debug('Email resent');
    }

    // text the code if user is signing up via phone
    if (typeof user.phone === 'string') {
      // sendConfirmationText(user.name, user.phone, code);
      // sendConfirmationEsms(user.name, user.phone, code);
      logger.debug('Phone resent');
    }

    return true;
  },

  /**
   * login
   */
  login: async (parent, { data }, { prisma, request, cache, i18n }, info) => {
    const user = await prisma.query.user(
      {
        where: {
          email: data.email,
          phone: data.phone,
        },
      },
      '{ id password enabled assignment { id retailers { id } }}',
    );

    if (!user) {
      const error = i18n._(t`Unable to login`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      const error = i18n._(t`User has not been confirmed or was disabled`);
      throw new Error(error);
    }

    const matched = verifyPassword(data.password, user.password);
    if (!matched) {
      const error = i18n._(t`Unable to login`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    // remove expired tokens
    // every time user login, scan user hashed-set to find which token is expired and remove it
    await cleanToken(user.id, cache);

    return {
      userId: user.id,
      hasRetailers: user.assignment && user.assignment.retailers && user.assignment.retailers.length > 0 ? true : false,
      // hasManufacturer: user.assignment.manufacturers && user.assignment.manufacturers.length > 0 ? true : false,
      token: generateToken(user.id, request, cache),
    };
  },

  /**
   * log out
   */
  logout: async (parent, { all }, { request, cache, i18n }) => {
    const token = getTokenFromRequest(request);
    const userId = await getUserIDFromRequest(request, cache, i18n);

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

  /**
   * update user
   * user must verify before updateing email/phone/pwd
   */
  updateUser: async (parent, { data }, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permissions
    const user = await gatekeeper.checkPermissions(request, 'USER', i18n);

    let newData;
    try {
      newData = validateUpdateInput(data);
    } catch (err) {
      logger.error(`🛑❌  Cannot create user ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const { email, phone, password, currentPassword } = newData;
    delete newData.password;
    delete newData.currentPassword;
    delete newData.email;
    delete newData.phone;

    logger.debug(phone);

    const updateData = { ...newData };

    // TODO: For user account recovery purpose, sensitive info like email, phone, password, etc. need to be archived

    try {
      let canUpdate = false;
      // verify current password
      // const user = await prisma.query.user(
      //   {
      //     where: {
      //       id: user.id,
      //     },
      //   },
      //   "{ id name email phone password }",
      // );

      if (currentPassword) {
        canUpdate = verifyPassword(currentPassword, user.password);

        if (!canUpdate) {
          const error = i18n._(t`Unable to update user profile`);
          throw new Error(error);
        }
      }

      // email is about to be changed
      if (typeof email === 'string' && canUpdate) {
        const code = generateConfirmation(cache, user.id, email);

        // sendConfirmationEmail(user.name, email, code);
        logger.debug('🔵✅  UPDATE USER: Change Email Confirmation Sent');

        // the update email flow is end when user confirms by enter the code
        // TODO: Archive current email somewhere else
      }

      // phone is about to be changed
      if (typeof phone === 'string' && canUpdate) {
        const code = generateConfirmation(cache, user.id, phone);

        // sendConfirmationText(user.name, phone, code);
        // sendConfirmationEsms(user.name, phone, code);
        logger.debug('🔵✅  UPDATE USER: Change Phone Confirmation Sent');

        // the update email flow is end when user confirms by enter the code
        // TODO: Archive current phone somewhere else
      }

      // both password and currentPassword present which means password is about to be changed
      if (typeof password === 'string' && typeof currentPassword === 'string' && canUpdate) {
        updateData.password = hashPassword(password);

        // TODO: Archive current password somewhere else
      }

      // TODO: Clean all token after email/phone/pwd changing?
      // deleteAllTokensInCache(cache, user.id);

      const updatedUser = prisma.mutation.updateUser(
        {
          where: {
            id: user.id,
          },
          data: updateData,
        },
        info,
      );

      // for transact-log
      logger.info(
        `UPDATE_USER | 1 | ${user.id} | ${updateData.name || undefined} | ${updateData.email ||
          undefined} | ${updateData.phone || undefined} | ${password || undefined}`,
      );

      return updatedUser;
    } catch (err) {
      logger.debug(`🛑❌  UPDATE_USER ${err}`);
      const error = i18n._(t`Unable to update user profile`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }
  },

  /**
   * delete user
   */
  // NOTE: moved to staff_mutations.js
  // deleteUser: async (parent, args, { prisma, request, cache, i18n }, info) => {
  //   // NOTE: check permissions
  //   const user = await gatekeeper.checkPermissions(request, "USER", i18n);

  //   await checkUserPermission(prisma, cache, request, i18n, {
  //     roles: ["ROOT"],
  //     permissions: ["DELETE_USER"],
  //   });

  //   deleteAllTokensInCache(cache, user.id);

  //   logger.info(`DELETE_USER | 1 | ${user.id}`);

  //   return prisma.mutation.deleteUser(
  //     {
  //       where: {
  //         id: user.id,
  //       },
  //     },
  //     info,
  //   );
  // },

  /**
   * request reset password
   * this will log user out of all devices
   */
  // TODO: check ip before performing this mutations, prevent that ip sends tons of requests
  requestResetPwd: async (parent, { mailOrPhone }, { prisma, request, cache, i18n }, info) => {
    const user = (await prisma.query.users(
      {
        where: {
          OR: [
            {
              email: mailOrPhone,
            },
            {
              phone: mailOrPhone,
            },
          ],
        },
      },
      `{ id securityAnswers { securityQuestion { id question } } enabled recoverable}`,
    )).pop();

    if (!user) {
      const error = i18n._(t`User not found`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      const error = i18n._(t`User has not been confirmed or was disabled`);
      throw new Error(error);
    }

    if (!user.recoverable) {
      const error = i18n._(t`Cannot recover user`);
      throw new Error(error);
    }

    // NOTE: log out of all devices
    deleteAllTokensInCache(cache, user.id);

    // TODO: should we disable this account?

    return {
      token: generateToken(user.id, request, cache),
      securityQuestions: user.securityAnswers.map(question => ({
        id: question.securityQuestion.id,
        question: question.securityQuestion.question,
      })),
    };
  },

  /**
   * reset password
   */
  resetPassword: async (parent, { data }, { prisma, request, cache, i18n }, info) => {
    const user = await gatekeeper.checkPermissions(request, 'USER', i18n);

    const newData = validateResetPwdInput(data);

    if (!user.enabled) {
      const error = i18n._(t`User has not been confirmed or was disabled`);
      throw new Error(error);
    }
    if (!user.recoverable) {
      const error = i18n._(t`Cannot recover user`);
      throw new Error(error);
    }

    const securityAnswer = user.securityInfo;
    const { securityInfo, password } = newData;

    const canResetPwd =
      securityInfo[0].answer === securityAnswers.find(x => x.questionId === securityInfo[0].questionId).answer &&
      securityInfo[1].answer === securityAnswers.find(x => x.questionId === securityInfo[1].questionId).answer &&
      securityInfo[2].answer === securityAnswers.find(x => x.questionId === securityInfo[2].questionId).answer &&
      securityInfo.length === 3;

    // TODO: after x tries, prevent user from trying to recover account in y minutes
    // TODO: we can add a new number field to User

    // change pwd if account is verified
    if (canResetPwd) {
      const updateUser = {
        password: hashPassword(password),
      };

      // remove all tokens from cache
      deleteAllTokensInCache(cache, user.id);

      // update user's new pwd
      await prisma.mutation.updateUser(
        {
          where: {
            id: user.id,
          },
          data: updateUser,
        },
        '{ password }',
      );

      // for transact-log
      logger.info(`RESET_PWD | 1 | ${user.id} | ${updatedUser.password}`);

      return true;
    }
    const error = i18n._(t`Unable to reset password`);
    throw new Error(error);
  },
};
