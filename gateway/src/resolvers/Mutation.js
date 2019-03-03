// @flow

import { saveProfileMedia } from '../utils/fsHelper';
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
  validateImageFileType,
  stringTrim,
  classifyEmailPhone,
} from '../utils/validation';
import logger from '../utils/logger';
import { sendConfirmationEmail } from '../utils/email';
import { sendConfirmationText } from '../utils/sms';
import { sendConfirmationEsms } from '../utils/smsVN';

// TODO: un-comment sendConfirmation functions
// NOTE: make sure that client has trimmed value before sending a request
// TODO: handling errors in a frendly way: https://www.youtube.com/watch?v=fUq1iHiDniY

const testState = () => {
  if (process.env.TEST_STATE) {
    // TODO: in testing: try to count how many times confirmation code was sent to user and
    // stop sending code
    logger.debug('TEST STATE');
  }
};

const Mutation = {
  /**
   * Create user
   * user must enter: name, email or phone and pwd
   */
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
      info,
    );

    const code = generateConfirmation(cache, user.id, data.email || data.phone);

    // email the code if user is signing up via email
    if (typeof data.email === 'string') {
      // sendConfirmationEmail(data.name, data.email, code);
      testState();
    }

    // text the code if user is signing up via phone
    if (typeof data.phone === 'string') {
      // TODO: try to find out where does the number come from, US or VN or other, choose the best way to send the code
      // sendConfirmationText(data.name, data.phone, code);
      // sendConfirmationEsms(user.phone, code);
      testState();
    }

    return user;
  },

  /**
   * Confirm user
   * Confirm email or phone
   */
  confirmUser: async (parent, { data }, { prisma, cache }, info) => {
    const newData = validateConfirmInput(data);

    const user = await prisma.query.user({
      where: {
        id: newData.userId,
        email: newData.email,
        phone: newData.phone,
      },
    });

    if (!user) {
      logger.debug(
        `🛑  CONFIRM_USER: User ${
          newData.userId ? newData.userId : newData.email ? newData.email : newData.phone
        } not found`,
      );
      throw new Error('Unable to confirm user'); // try NOT to provide enough information so hackers can guess
    }

    // NOTE: matched contains email or phone
    const matched = await verifyConfirmation(cache, newData.code, user.id);
    logger.debug(`confirmation matched: ${matched}`);
    if (!matched) {
      throw new Error('Unable to confirm user');
    }

    // change to true on matched input
    const updateData = classifyEmailPhone(matched);
    updateData.enabled = true;

    await prisma.mutation.updateUser({
      where: {
        id: user.id,
      },
      data: updateData,
    });

    return true;
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
      logger.debug(`🛑 CREATE_SECURITY_INFO: User ${userId} not found`);
      throw new Error('Unable to confirm user'); // try NOT to provide enough information so hackers can guess
    }

    // NOTE: insert new question (if user enters) and create to-be-updated data
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

    // NOTE: delete old securityInfo and insert the new one
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

  /**
   * Resend confirmation
   * using this to send a confirmation code to phone or email
   */
  resendConfirmation: async (parent, { data }, { prisma, cache }, info) => {
    const newData = validateResendConfirmationInput(data);

    const user = await prisma.query.user({
      where: {
        id: newData.userId,
        email: newData.email,
        phone: newData.phone,
      },
    });

    if (!user) {
      throw new Error('Unable to resend confirmation'); // try NOT to provide enough information so hackers can guess
    }

    logger.debug(
      `user id ${user.id}, name ${user.name}, email ${user.email}, password ${user.phone}, enabled ${user.enabled}`,
    );

    if (user.enabled && (newData.email === user.email || newData.phone === user.phone)) {
      throw new Error('User profile has been confirmed');
    }

    const code = generateConfirmation(cache, user.id, newData.email || newData.phone || user.email || user.phone);

    // case: user updates info and confirm new info
    // case: user wants to confirm account after signed up but not confirmed yet (disconnect or ST else)
    if (user.enabled) {
      if (typeof newData.email === 'string') {
        // sendConfirmationEmail(user.name, user.email, code);
        logger.debug('Email resent');
      }

      // text the code if user is signing up via phone
      if (typeof newData.phone === 'string') {
        // sendConfirmationText(user.name, user.phone, code);
        // sendConfirmationEsms(user.phone, code);
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
      // sendConfirmationEsms(user.phone, code);
      logger.debug('Phone resent');
    }

    return true;
  },

  // TODO: limit the size of uploaded file
  // TODO: limit the number of file to be uploaded
  /**
   * Upload avatar
   * one file one time
   */
  uploadProfileMedia: async (parent, { file }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.debug(`🛑 UPLOAD_PROFILE_MEDIA: User ${userId} not found`);
      throw new Error('Unable to upload avatar'); // try NOT to provide enough information so hackers can guess
    }

    // NOTE: stream is deprecated, but apolo-upload-client didnot updated yet
    const { createReadStream, filename, mimetype, encoding } = await file;

    // NOTE: validate mimetype, only accept jpeg, png, svg and gif
    validateImageFileType(mimetype);

    // NOTE: stream file content into cloud and get the file URL after streamed
    const media = await saveProfileMedia(filename, userId, createReadStream);
    media.mime = mimetype;

    // save filename (new avatar) to DB
    const updatedUser = await prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: {
          profileMedia: {
            create: media,
          },
        },
      },
      `{ id profileMedia { id name ext mime size hash sha256 uri createdAt updatedAt } }`,
    );

    // NOTE: client uses url to request a static file
    // NOTE: resolver will change url (now is name) to a truly url (with protocol and host)
    return updatedUser.profileMedia;
  },

  /**
   * login
   */
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
      userId: user.id,
      token: generateToken(user.id, request, cache),
    };
  },

  /**
   * log out
   */
  logout: async (parent, { all }, { request, cache }) => {
    const token = getTokenFromRequest(request);
    const userId = await getUserIDFromRequest(request, cache);

    if (all) {
      deleteAllTokensInCache(cache, userId);
    } else {
      deleteTokenInCache(cache, userId, token);
    }

    return {
      userId,
      token,
    };
  },

  /**
   * update user
   * user must verify before updateing email/phone/pwd
   */
  updateUser: async (parent, { data }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const newData = validateUpdateInput(data);

    const { password, currentPassword } = newData;
    delete newData.password;
    delete newData.currentPassword;

    const updateData = { ...newData };

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
      if (typeof newData.email === 'string' && canUpdate) {
        const code = generateConfirmation(cache, userId, newData.email);

        // sendConfirmationEmail(newData.name, newData.email, code);

        delete updateData.email;

        // the update email flow is end when user confirms by enter the code
        // TODO: Archive current email somewhere else
      }

      // phone is about to be changed
      if (typeof newData.phone === 'string' && canUpdate) {
        const code = generateConfirmation(cache, userId, newData.phone);

        // sendConfirmationText(newData.name, newData.phone, code);
        // sendConfirmationEsms(user.phone, code);

        delete updateData.phone;

        // the update email flow is end when user confirms by enter the code
        // TODO: Archive current phone somewhere else
      }

      // both password and currentPassword present which means password is about to be changed
      if (typeof password === 'string' && typeof currentPassword === 'string' && canUpdate) {
        updateData.password = hashPassword(password);

        // TODO: Archive current password somewhere else
      }

      // TODO: Should clean all token after email/phone/pwd changing?
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
      logger.debug(`🛑 UPDATE_USER ${error}`);
      throw new Error('Unable to update user profile'); // try NOT to provide enough information so hackers can guess
    }
  },

  /**
   * delete user
   */
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

  /**
   * request reset password
   * this will log user out of all devices
   */
  requestResetPwd: async (parent, { mailOrPhone }, { prisma, request, cache }, info) => {
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
      throw new Error('Account does not exist'); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      throw new Error('Account has not been confirmed or was disabled');
    }

    if (!user.recoverable) {
      throw new Error('Cannot recover this account!');
    }

    // NOTE: log out of all devices
    deleteAllTokensInCache(cache, user.id);

    // TODO: should we disable current account?

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
