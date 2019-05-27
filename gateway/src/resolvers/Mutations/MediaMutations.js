// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { s3ProductMediasUploader } from "../../utils/s3Uploader";

// TODO: optimize me by using promiseAll

export const Mutation = {
  uploadProductMedias: async (parent, { files }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const productMedias = await Promise.all(
      files.map(async file => {
        const uploaded = await file;
        const media = await s3ProductMediasUploader(prisma, uploaded, userId);
        return media;
      }),
    );

    return productMedias;
  },
};
