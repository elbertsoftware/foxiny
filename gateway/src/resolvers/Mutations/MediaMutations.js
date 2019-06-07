// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { s3ProfileMediaUploader, s3ProductMediasUploader, s3DocumentsUploader } from "../../utils/s3Uploader";
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
        const media = await s3ProductMediasUploader(prisma, uploaded, { userId: user.id });
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
  uploadBusinessCover: async (parent, { file, sellerId }, { prisma, request, cache, i18n }, info) => {
    const uploadedFile = await file;
    try {
      validateImageUploadInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw error;
    }

    // TODO: check permission, optimized these following lines
    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      "{ id assignment { id retailers { id } } }",
    );

    if (
      !user ||
      !user.assignment ||
      !user.assignment.retailers ||
      !user.assignment.retailers.length > 0 ||
      !user.assignment.retailers.map(retailer => retailer.id).includes(sellerId)
    ) {
      logger.error(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found or Retailer ${sellerId} not found`);
      const error = i18n._(t`Unable to upload avatar`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, { sellerId: sellerId, isCover: true });
  },

  /**
   * Upload business cover
   * one file one time
   */
  uploadBusinessAvatar: async (parent, { file, sellerId }, { prisma, request, cache, i18n }, info) => {
    const uploadedFile = await file;
    try {
      validateImageUploadInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    // TODO: check permission, optimized these following lines
    const userId = await getUserIDFromRequest(request, cache, i18n);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      "{ id assignment { id retailers { id } } }",
    );

    if (
      !user ||
      !user.assignment ||
      !user.assignment.retailers ||
      !user.assignment.retailers.length > 0 ||
      !user.assignment.retailers.map(retailer => retailer.id).includes(sellerId)
    ) {
      logger.error(`🛑❌  UPLOAD_PROFILE_MEDIA: User ${userId} not found or Retailer ${sellerId} not found`);
      const error = i18n._(t`Unable to upload avatar`);
      throw new Error(error); // try NOT to provide enough information so hackers can guess
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, { sellerId: sellerId, isAvatar: true });
  },

  uploadSocialIDMediaRetailer: async (parent, { files, sellerId }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    // TODO: validate input
    // TODO: check permission

    const medias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;
        const media = await s3DocumentsUploader(prisma, uploaded, {
          sellerId: sellerId,
          isDocument: true,
          isSocialID: true,
        });
        return await media;
      }),
    );

    const updatedRetailer = await prisma.mutation.updateRetailer({
      where: {
        id: sellerId,
      },
      data: {
        socialNumberImages: {
          connect: medias.map(media => ({
            id: media.id,
          })),
        },
      },
    });

    return medias;
  },

  deleteSocialIDMediaRetailer: async (parent, { fileIds, sellerId }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    // TODO: validate input
    // TODO: check permission

    await prisma.mutation.updateRetailer({
      where: {
        id: sellerId,
      },
      data: {
        socialNumberImages: {
          disconnect: medias.map(media => ({
            id: media.id,
          })),
        },
      },
    });

    return fileIds;
  },

  uploadBusinessLicenseMediaRetailer: async (parent, { files, sellerId }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    // TODO: validate input
    // TODO: check permission

    const medias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;
        const media = await s3DocumentsUploader(prisma, uploaded, {
          sellerId: sellerId,
          isDocument: true,
          isBusinessLicense: true,
        });
        return media;
      }),
    );

    const updatedRetailer = await prisma.mutation.updateRetailer({
      where: {
        id: sellerId,
      },
      data: {
        businessLicenseImages: {
          connect: medias.map(media => ({
            id: media.id,
          })),
        },
      },
    });
    return medias;
  },

  deleteBusinessLicenseMediaRetailer: async (parent, { fileIds, sellerId }, { prisma, request, cache, i18n }, info) => {
    const userId = await getUserIDFromRequest(request, cache, i18n);

    // TODO: validate input
    // TODO: check permission

    await prisma.mutation.updateRetailer({
      where: {
        id: sellerId,
      },
      data: {
        businessLicenseImages: {
          disconnect: medias.map(media => ({
            id: media.id,
          })),
        },
      },
    });

    return fileIds;
  },
};
