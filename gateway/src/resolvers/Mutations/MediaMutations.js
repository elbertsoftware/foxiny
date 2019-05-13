// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { s3ProductMediasUploader } from "../../utils/s3Uploader";

// TODO: optimize me by using promiseAll

export const Mutation = {
  uploadProductMedias: async (parent, { files }, { prisma, request, cache }, info) => {
    const userId = await getUserIDFromRequest(request, cache);

    const productMedias = [];

    for (let i = 0; i < files.length; i++) {
      const upload = await files[i];
      const media = await s3ProductMediasUploader(prisma, upload, userId);
      productMedias.push(media);
    }

    return productMedias;
  },
};
