// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { s3ProfileMediaUploader, s3ProductMediasUploader } from "../../utils/s3Uploader";
import { validateImageUploadInput } from "../../utils/validation";

// TODO: optimize me by using promiseAll

export const Mutation = {
  /**
   * Upload avatar
   * one file one time
   */
  uploadProfileMedia: async (parent, { file }, { prisma, request, cache, i18n }, info) => {
    const uploadedFile = await file;
    try {
      validateImageUploadInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.debug(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found`);
      const error = i18n._(t`Unable to upload avatar`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, { userId: user.id });
  },

  uploadProductMedias: async (parent, { files }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    const productMedias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;
        const media = await s3ProductMediasUploader(prisma, uploaded, userId);
        return media;
      }),
    );

    return productMedias;
  },

  // NOTE: upload business avatar and cover do not log who requested

  /**
   * Upload business cover
   * one file one time
   */
  uploadBusinessCover: async (parent, { file, retailerId }, { prisma, request, cache, i18n }, info) => {
    const uploadedFile = await file;
    try {
      validateImageUploadInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw error;
    }

    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      "id assignment { id retailers { id } }",
    );

    if (
      !user ||
      !user.assignment ||
      !user.assignment.retailers ||
      !user.assignment.retailers.length > 0 ||
      !user.assignment.retailers.includes(retailerId)
    ) {
      logger.debug(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found or Retailer ${retailerId} not found`);
      const error = i18n._(t`Unable to upload avatar`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, { retailerId: retailerId, isCover: true });
  },

  /**
   * Upload business cover
   * one file one time
   */
  uploadBusinessCover: async (parent, { file, retailerId }, { prisma, request, cache, i18n }, info) => {
    const uploadedFile = await file;
    try {
      validateImageUploadInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      "id assignment { id retailers { id } }",
    );

    if (
      !user ||
      !user.assignment ||
      !user.assignment.retailers ||
      !user.assignment.retailers.length > 0 ||
      !user.assignment.retailers.includes(retailerId)
    ) {
      logger.error(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found or Retailer ${retailerId} not found`);
      const error = i18n._(t`Unable to upload avatar`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, { retailerId: retailerId, isAvatar: true });
  },

  /**
   * Upload avatar
   * one file one time
   */
  uploadBusinessAvatar: async (parent, { file }, { prisma, request, cache, i18n }, info) => {
    const uploadedFile = await file;
    try {
      validateImageUploadInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Cannot upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found`);
      const error = i18n._(t`Unable to upload avatar`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, user.id);
  },
};
