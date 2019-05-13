// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { s3ProductMediasUploader } from "../../utils/s3Uploader";

export const Mutation = {
  uploadProductMedias: async (parent, { productId, files }, { prisma, request, cache }, info) => {
    const { resolve, reject } = await Promise.all(
      files.map(async file => {
        const uploadedFile = await file;
        validateImageUploadInput(uploadedFile);

        const product = await prisma.query.product({
          where: { id: productId },
        });

        if (!product) {
          logger.debug(`🛑❌  UPLOAD_PRODUCT_MEDIAS: Product ${productId} not found`);
          throw new Error("Unable to upload product medias"); // try NOT to provide enough information so hackers can guess
        }
        return s3ProductMediasUploader(prisma, file);
      }),
    );

    return resolve;
  },
};
