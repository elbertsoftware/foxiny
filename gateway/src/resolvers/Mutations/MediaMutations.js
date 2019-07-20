// @flow

import { t } from '@lingui/macro';
import logger from '../../utils/logger';
import { s3ProfileMediaUploader, s3ProductMediasUploader, s3DocumentsUploader } from '../../utils/s3Uploader';
import { validateUploadImageInput, validateUploadDocumnetInput } from '../../utils/validation';
import { gatekeeper } from '../../utils/permissionChecker';
import { getUserIDFromRequest } from '../../utils/authentication';

// TODO: optimize me by using promiseAll

export const Mutation = {
  /**
   * Upload avatar
   * one file one time
   */
  uploadProfileMedia: async (parent, { file }, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_USER', i18n);

    const uploadedFile = await file;
    try {
      validateUploadImageInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    return s3ProfileMediaUploader(prisma, uploadedFile, { userId: user.id });
  },

  uploadProductMedias: async (parent, { files }, { prisma, request, cache, i18n }, info) => {
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_RETAILER', i18n);

    const productMedias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;
        const media = await s3ProductMediasUploader(prisma, uploaded, {
          userId: user.id,
        });
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
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_SELLER', i18n, sellerId);

    const uploadedFile = await file;
    try {
      validateUploadImageInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw error;
    }

    // NOTE: upload and save to db
    return s3ProfileMediaUploader(prisma, uploadedFile, {
      sellerId: sellerId,
      isCover: true,
    });
  },

  /**
   * Upload business cover
   * one file one time
   */
  uploadBusinessAvatar: async (parent, { file, sellerId }, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_SELLER', i18n, sellerId);

    const uploadedFile = await file;
    try {
      validateUploadImageInput(uploadedFile);
    } catch (err) {
      logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
      const error = i18n._(t`Invalid input`);
      throw new Error(error);
    }

    // NOTE: upload and save to db
    return s3ProfileMediaUploader(prisma, uploadedFile, {
      sellerId: sellerId,
      isAvatar: true,
    });
  },

  uploadSocialIDMediaRetailer: async (parent, { files, sellerId }, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permission
    // const user = await gatekeeper.checkPermissions(request, 'MEDIA_SELLER', i18n, sellerId);

    // NOTE: upload file to S3
    const medias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;

        // validate input
        try {
          validateUploadImageInput(uploaded);
        } catch (err) {
          logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
          const error = i18n._(t`Invalid input`);
          throw new Error(error);
        }

        const media = await s3DocumentsUploader(prisma, uploaded, {
          sellerId: sellerId,
          isDocument: true,
          isSocialID: true,
        });
        return await media;
      }),
    );

    // NOTE: update retailer
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
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_SELLER', i18n, sellerId);

    await prisma.mutation.updateRetailer({
      where: {
        id: sellerId,
      },
      data: {
        socialNumberImages: {
          disconnect: fileIds.map(id => ({
            id: id,
          })),
        },
      },
    });

    return fileIds;
  },

  uploadBusinessLicenseMediaRetailer: async (parent, { files, sellerId }, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_SELLER', i18n, sellerId);

    // NOTE: Upload files to S3
    const medias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;

        // validate input
        try {
          validateUploadDocumnetInput(uploaded);
        } catch (err) {
          logger.error(`🛑❌  Unable to upload avatar ${err.message}`);
          const error = i18n._(t`Invalid input`);
          throw new Error(error);
        }

        const media = await s3DocumentsUploader(prisma, uploaded, {
          sellerId: sellerId,
          isDocument: true,
          isBusinessLicense: true,
        });
        return media;
      }),
    );

    // NOTE: update retailer
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
    // NOTE: check permission
    const user = await gatekeeper.checkPermissions(request, 'MEDIA_SELLER', i18n, sellerId);

    await prisma.mutation.updateRetailer({
      where: {
        id: sellerId,
      },
      data: {
        businessLicenseImages: {
          disconnect: fileIds.map(id => ({
            id: id,
          })),
        },
      },
    });

    return fileIds;
  },
};
