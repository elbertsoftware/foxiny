// @flow

import AWS from 'aws-sdk';
import cuid from 'cuid';
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

const saveToUser = async (prisma, userId, data) => {
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
};

const saveToRetailer = async (prisma, retailerId, data, args) => {
  if (args.isAvatar) {
    const updatedRetailer = await prisma.mutation.updateRetailer(
      {
        where: {
          id: userId,
        },
        data: {
          businessAvatar: {
            create: data,
          },
        },
      },
      `{ id businessAvatar { id name ext mime size hash sha256 uri createdAt updatedAt } }`,
    );
    // for transact-log
    logger.info(
      `UPLOAD_BUSINESS_AVATAR | ${retailerId} | ${data.uri} | ${data.name} | ${data.ext} | ${data.mime} | ${
        data.hash
      } | ${data.sha256} | ${data.size}`,
    );
    return updatedRetailer.businessAvatar;
  }

  if (args.isCover) {
    const updatedRetailer = await prisma.mutation.updateRetailer(
      {
        where: {
          id: userId,
        },
        data: {
          businessCover: {
            create: data,
          },
        },
      },
      `{ id businessCover { id name ext mime size hash sha256 uri createdAt updatedAt } }`,
    );
    // for transact-log
    logger.info(
      `UPLOAD_BUSINESS_COVER | ${retailerId} | ${data.uri} | ${data.name} | ${data.ext} | ${data.mime} | ${
        data.hash
      } | ${data.sha256} | ${data.size}`,
    );
    return updatedRetailer.businessCover;
  }
};

// TODO: save-to-Manufacturer is the same as save-to-Retailer

/**
 * Upload profile media to aws s3
 * @param {Object} prisma prisma server
 * @param {Object} upload upload stream
 * @param {String} userId Id of user
 */
const s3ProfileMediaUploader = async (prisma, upload, args) => {
  if (!upload || args === undefined || (args.userId && args.retailerId && args.manufacturerId === false)) {
    throw new Error('🛑❌  S3PROFILEMEDIAUPLOADER: NO FILE OR DIRECTORIY');
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = upload;

    let readStream;

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'testing') readStream = createReadStream;
    else readStream = createReadStream();

    const data = await getFileInfo(filename, args.userId || args.retailerId || args.manufacturerId, createReadStream);

    const key = `${args.userId || args.retailerId || args.manufacturerId}_${new Date().getTime()}.${data.ext}`; // pattern: userID_tick.extention
    logger.debug(`🔵✅  READ FILE: done. UPLOADING ${key} TO S3...`);
    // Upload to S3
    const response = await s3
      .upload({
        Key: `${
          args.userId ? 'users' : args.retailerId ? 'retailers' : args.manufacturerId ? 'manufacturers' : 'products'
        }/${args.userId || args.retailerId || args.manufacturerId}/${key}`,
        ACL: `public-read`,
        Body: readStream,
      })
      .promise();

    data.uri = response.Location;
    data.mime = mimetype;
    logger.debug(`🔵✅  UPLOADED: file location ${data.uri}`);

    if (args.userId) {
      return saveToUser(prisma, args.userId, data);
    }
    if (args.retailerId) {
      return saveToRetailer(prisma, args.retailerId, data, args);
    }
    // if (args.manufacturerId) {
    //   return saveToManufacturer(args.manufacturerId, data, args);
    // }
  } catch (error) {
    logger.debug(`🔴❌  [foxiny-gateway] s3ProfileMediaUploader error`);
    logger.debug(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

const s3ProductMediasUploader = async (prisma, upload, userId) => {
  if (!upload) {
    throw new Error('🛑❌  S3PRODUCTMEDIASUPLOADER: NO FILE');
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = upload;

    logger.debug('hello');

    let readStream;

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'testing') readStream = createReadStream;
    else readStream = createReadStream();

    const data = await getFileInfo(filename, userId, createReadStream);

    const key = `${userId}_${new Date().getTime()}.${data.ext}`; // pattern: userId_tick.extention
    logger.debug(`🔵✅  READ FILE: done. UPLOADING ${key} TO S3...`);
    // Upload to S3
    const response = await s3
      .upload({
        Key: `products/${key}`,
        ACL: `public-read`,
        Body: readStream,
      })
      .promise();

    data.uri = response.Location;
    data.mime = mimetype;
    logger.debug(`🔵✅  UPLOADED: file location ${data.uri}`);

    const media = await prisma.mutation.createMedia({
      data,
    });

    // for transact-log
    logger.info(
      `UPLOAD_PRODUCT_MEDIA | ${userId} | ${data.uri} | ${data.name} | ${data.ext} | ${data.mime} | ${data.hash} | ${
        data.sha256
      } | ${data.size}`,
    );

    return media;
  } catch (error) {
    logger.debug(`🔴❌  [foxiny-gateway] s3ProductMediasUploader error`);
    logger.debug(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

export { s3ProfileMediaUploader, s3ProductMediasUploader };
