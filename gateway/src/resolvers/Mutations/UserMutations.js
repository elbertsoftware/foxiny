// @flow

import { s3ProfileMediaUploader } from "../../utils/s3Uploader";
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
} from "../../utils/authentication";
import {
  validateCreateInput,
  validateConfirmInput,
  validateSecurityInfo,
  validateResendConfirmationInput,
  validateUpdateInput,
  validateResetPwdInput,
  validateImageUploadInput,
  classifyEmailPhone,
} from "../../utils/validation";
import logger from "../../utils/logger";
import { sendConfirmationEmail } from "../../utils/email";
import { sendConfirmationText } from "../../utils/sms";
import { sendConfirmationEsms } from "../../utils/smsVN";

// TODO: un-comment sendConfirmation
// TODO: handling errors in a frendly way: https://www.youtube.com/watch?v=fUq1iHiDniY
// NOTE: almost of data input will be validated, trimmed and normalized

export const Mutation = {
  /**
   * Create user
   * user must enter: name, email or phone and pwd
   */
  createUser: async (parent, { data }, { prisma, cache, request }, info) => {
    const newData = validateCreateInput(data);

    const password = hashPassword(newData.password);
    const user = await prisma.mutation.createUser(
      {
        data: {
          ...newData,
          password, // replace plain text password with the hashed one
          enabled: false, // user needs to confirm before the account become enabled
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
    if (typeof newData.email === "string") {
      sendConfirmationEmail(newData.name, newData.email, code);
    }

    // text the code if user is signing up via phone
    if (typeof newData.phone === "string") {
      // TODO: try to find out where does the number come from, US or VN or other, and choose the best way to send the code
      sendConfirmationText(newData.name, newData.phone, code);
      // sendConfirmationEsms(newData.name, newData.phone, code);
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
        `🛑❌  CONFIRM_USER: User ${
          newData.userId ? newData.userId : newData.email ? newData.email : newData.phone
        } not found`,
      );
      throw new Error("Unable to confirm user"); // try NOT to provide enough information so hackers can guess
    }

    // NOTE: matched contains email or phone
    const matched = await verifyConfirmation(cache, newData.code, user.id);
    logger.debug(`confirmation matched: ${matched}`);
    if (!matched) {
      throw new Error("Unable to confirm user");
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
  upsertSecurityInfo: async (parent, { securityInfo }, { prisma, cache, request }, info) => {
    const newData = validateSecurityInfo(securityInfo);

    const userId = await getUserIDFromRequest(request, cache);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.debug(`🛑❌  CREATE_SECURITY_INFO: User ${userId} not found`);
      throw new Error("Unable to confirm user"); // try NOT to provide enough information so hackers can guess
    }

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

    // for transact-log
    logger.info(
      `UPSERT_SECINFO | 1 | ${userId} | ${updateData[0].questionId} | ${updateData[0].answer} | ${
        updateData[1].questionId
      } | ${updateData[1].answer} | ${updateData[2].questionId} | ${updateData[2].answer}`,
    );

    return updatedUser;
  },

  /**
   * Resend confirmation
   * using this to send a confirmation code to phone or email
   */
  resendConfirmation: async (parent, { data }, { prisma, cache, request }, info) => {
    // NOTE: (for client) one of three: userId, email and phone is accepted only
    const newData = validateResendConfirmationInput(data);

    const userId = await getUserIDFromRequest(request, cache, false);
    const user = await prisma.query.user({
      where: {
        id: newData.userId || userId,
        email: newData.email,
        phone: newData.phone,
      },
    });

    if (!user) {
      throw new Error("Unable to resend confirmation"); // try NOT to provide enough information so hackers can guess
    }

    logger.debug(
      `user id ${user.id}, name ${user.name}, email ${user.email}, password ${user.phone}, enabled ${user.enabled}`,
    );

    if (user.enabled && (newData.email === user.email || newData.phone === user.phone)) {
      throw new Error("User profile has been confirmed");
    }

    const code = generateConfirmation(cache, user.id, newData.email || newData.phone || user.email || user.phone);

    // case: user updates info and confirm new info
    // case: user wants to confirm account after signed up but not confirmed yet (disconnect or ST else)
    if (user.enabled) {
      if (typeof newData.email === "string") {
        sendConfirmationEmail(user.name, newData.email, code);
        logger.debug("Email resent");
      }

      // text the code if user is signing up via phone
      if (typeof newData.phone === "string") {
        sendConfirmationText(user.name, newData.phone, code);
        // sendConfirmationEsms(user.name, newData.phone, code);
        logger.debug("Phone resent");
      }
      return true;
    }

    // email the code if user is signing up via email
    if (typeof user.email === "string") {
      sendConfirmationEmail(user.name, user.email, code);
      logger.debug("Email resent");
    }

    // text the code if user is signing up via phone
    if (typeof user.phone === "string") {
      sendConfirmationText(user.name, user.phone, code);
      // sendConfirmationEsms(user.name, user.phone, code);
      logger.debug("Phone resent");
    }

    return true;
  },

  /**
   * Upload avatar
   * one file one time
   */
  uploadProfileMedia: async (parent, { file }, { prisma, request, cache }, info) => {
    const uploadedFile = await file;
    validateImageUploadInput(uploadedFile);

    const userId = await getUserIDFromRequest(request, cache);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.debug(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found`);
      throw new Error("Unable to upload avatar"); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, user.id);
  },

  /**
   * login
   */
  login: async (parent, { data }, { prisma, request, cache, info }) => {
    const user = await prisma.query.user(
      {
        where: {
          email: data.email,
          phone: data.phone,
        },
      },
      "{ id name profile profileMedia { id uri } badgeMedias {id uri } addresses { id description region name phone street unit district city state zip } email phone password enabled recoverable assignment { id retailers { id businessName businessEmail businessPhone businessAddress { id description region name phone street unit district city state zip } businessMedia { id uri } businessLicense enabled createdAt updatedAt } } createdAt updatedAt }",
    );

    if (!user) {
      throw new Error("Unable to login"); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      throw new Error("User profile has not been confirmed or was disabled");
    }

    const matched = verifyPassword(data.password, user.password);
    if (!matched) {
      throw new Error("Unable to login"); // try NOT to provide enough information so hackers can guess
    }

    // remove expired tokens
    // every time user login, scan user hashed-set to find which token is expired and remove it
    await cleanToken(user.id, cache);

    return {
      userId: user.id,
      userProfile: {
        id: user.id,
        name: user.name,
        profile: user.profile,
        profileMedia: user.profileMedia,
        badgeMedias: user.badgeMedias,
        addresses: user.addresses,
        email: user.email,
        phone: user.phone,
        password: user.password,
        enabled: user.enabled,
        recoverable: user.recoverable,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        assignment: {
          id: user.assignment ? user.assignment.id : undefined,
          user: user,
          retailers: user.assignment ? user.assignment.retailers : undefined,
        },
      },
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
      token,
      userId,
    };
  },

  /**
   * update user
   * user must verify before updateing email/phone/pwd
   */
  updateUser: async (parent, { data }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const newData = validateUpdateInput(data);

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
      const user = await prisma.query.user(
        {
          where: {
            id: userId,
          },
        },
        "{ id name email phone password }",
      );

      if (currentPassword) {
        canUpdate = verifyPassword(currentPassword, user.password);

        if (!canUpdate) {
          throw new Error("Unable to update user profile"); // try NOT to provide enough information so hackers can guess
        }
      }

      // email is about to be changed
      if (typeof email === "string" && canUpdate) {
        const code = generateConfirmation(cache, userId, email);

        sendConfirmationEmail(user.name, email, code);
        logger.debug("🔵✅  UPDATE USER: Change Email Confirmation Sent");

        // the update email flow is end when user confirms by enter the code
        // TODO: Archive current email somewhere else
      }

      // phone is about to be changed
      if (typeof phone === "string" && canUpdate) {
        const code = generateConfirmation(cache, userId, phone);

        sendConfirmationText(user.name, phone, code);
        // sendConfirmationEsms(user.name, phone, code);
        logger.debug("🔵✅  UPDATE USER: Change Phone Confirmation Sent");

        // the update email flow is end when user confirms by enter the code
        // TODO: Archive current phone somewhere else
      }

      // both password and currentPassword present which means password is about to be changed
      if (typeof password === "string" && typeof currentPassword === "string" && canUpdate) {
        updateData.password = hashPassword(password);

        // TODO: Archive current password somewhere else
      }

      // TODO: Clean all token after email/phone/pwd changing?
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

      // for transact-log
      logger.info(
        `UPDATE_USER | 1 | ${userId} | ${updateData.name || undefined} | ${updateData.email ||
          undefined} | ${updateData.phone || undefined} | ${password || undefined}`,
      );

      return updatedUser;
    } catch (error) {
      logger.debug(`🛑❌  UPDATE_USER ${error}`);
      throw new Error("Unable to update user profile"); // try NOT to provide enough information so hackers can guess
    }
  },

  /**
   * delete user
   */
  deleteUser: async (parent, args, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    deleteAllTokensInCache(cache, userId);

    logger.info(`DELETE_USER | 1 | ${userId}`);

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
      throw new Error("Account does not exist"); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      throw new Error("Account has not been confirmed or was disabled");
    }

    if (!user.recoverable) {
      throw new Error("Cannot recover this account!");
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
  resetPassword: async (parent, { data }, { prisma, request, cache }, info) => {
    const newData = validateResetPwdInput(data);

    const userId = await getUserIDFromRequest(request, cache, false);

    if (!userId) throw new Error("Unable to reset password");

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      `{ id securityAnswers { securityQuestion { id question } answer } enabled}`,
    );

    if (!user) {
      throw new Error("Unable to reset password"); // try NOT to provide enough information so hackers can guess
    }

    if (!user.enabled) {
      throw new Error("User profile has not been confirmed or was disabled");
    }

    const { securityAnswers } = user;
    const { securityInfo } = newData;

    const canResetPwd =
      securityInfo[0].answer ===
        securityAnswers.find(x => x.securityQuestion.id === securityInfo[0].questionId).answer &&
      securityInfo[1].answer ===
        securityAnswers.find(x => x.securityQuestion.id === securityInfo[1].questionId).answer &&
      securityInfo[2].answer ===
        securityAnswers.find(x => x.securityQuestion.id === securityInfo[2].questionId).answer &&
      securityInfo.length === 3;

    // TODO: after x tries, prevent user from trying to recover account in y minutes
    // TODO: we can add a new number field to User

    // change pwd if account is verified
    if (canResetPwd) {
      const updateUser = {
        password: hashPassword(newData.password),
      };

      // remove all tokens from cache
      deleteAllTokensInCache(cache, userId);

      // update user's new pwd
      await prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: updateUser,
        },
        "{ password }",
      );

      // for transact-log
      logger.info(`RESET_PWD | 1 | ${userId} | ${newData.password}`);

      return true;
    }

    throw new Error("Unable to perform reset password request");
  },
};
