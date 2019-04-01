// @flow

import AWS from 'aws-sdk';
import { getFileInfo } from './fsHelper';
import logger from './logger';

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: process.env.S3_IMAGES_BUCKET,
  },
});

/**
 * Upload profile media to aws s3
 * @param {Object} prisma prisma server
 * @param {Object} upload upload stream
 * @param {String} userId Id of user
 */
const s3ProfileMediaUploader = async (prisma, upload, userId) => {
  if (!upload) {
    throw new Error('🛑❌  S3PROFILEMEDIAUPLOADER: NO FILE');
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = upload;

    let readStream;

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'testing') readStream = createReadStream;
    else readStream = createReadStream();

    const data = await getFileInfo(filename, userId, createReadStream);

    const key = `${userId}_${new Date().getTime()}.${data.ext}`; // pattern: userID_tick.extention
    logger.debug(`🔵✅  READ FILE: done. UPLOADING ${key} TO S3...`);
    // Upload to S3
    const response = await s3
      .upload({
        Key: `images/${key}`,
        ACL: `public-read`,
        Body: readStream,
      })
      .promise();

    data.uri = response.Location;
    data.mime = mimetype;
    logger.debug(`🔵✅  UPLOADED: file location ${data.uri}`);

    const updatedUser = await prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: {
          profileMedia: {
            create: data,
          },
        },
      },
      `{ id profileMedia { id name ext mime size hash sha256 uri createdAt updatedAt } }`,
    );

    // for transact-log
    logger.info(
      `UPLOAD_AVATAR | ${userId} | ${data.uri} | ${data.name} | ${data.ext} | ${data.mime} | ${data.hash} | ${
        data.sha256
      } | ${data.size}`,
    );

    return updatedUser.profileMedia;
  } catch (error) {
    logger.debug(`🔴❌  [foxiny-gateway] s3ProfileMediaUploader error`);
    logger.debug(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

export { s3ProfileMediaUploader };
