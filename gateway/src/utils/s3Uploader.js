// @flow

import AWS from "aws-sdk";
import cuid from "cuid";
import { getFileInfo } from "./fsHelper";
import logger from "./logger";

// TODO: subfolder is no-need
// TODO: keep only filename

// NOTE: AWS S3 declaration
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {
    Bucket: process.env.S3_IMAGES_BUCKET,
  },
});

/**
 * rename uploaded filed
 * @param {String} id userId or selleId
 * @param {String} filename raw file name
 * @param {String} ext file extension
 */
const renameFile = (id, filename, ext) => {
  const newFilename = `${id}_${filename}.${ext}`;
  return newFilename;
};

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
          id: retailerId,
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
          id: retailerId,
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
 * Upload business profile media to aws s3
 * @param {Object} prisma prisma server
 * @param {Object} upload upload stream
 * @param {Object} args includes sellerId or manufacturerId
 */
const s3ProfileMediaUploader = async (prisma, upload, args) => {
  if (!upload || args === undefined || (args.userId && args.sellerId === false)) {
    throw new Error("🛑❌  S3PROFILEMEDIAUPLOADER: NO FILE OR DIRECTORIY");
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = upload;

    let readStream;

    if (process.env.NODE_ENV && process.env.NODE_ENV === "testing") readStream = createReadStream;
    else readStream = createReadStream();

    const data = await getFileInfo(filename, args.userId || args.sellerId, createReadStream);

    const key = renameFile(args.userId || args.sellerId, data.name, data.ext); // pattern: userID_tick.extention
    logger.debug(`🔵✅  READ FILE: done. UPLOADING ${key} TO S3...`);
    // Upload to S3
    const response = await s3
      .upload({
        Key: `${args.userId ? "users" : args.sellerId ? "seller" : "unknown"}/${args.userId || args.sellerId}/${key}`,
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
    const belongToRetailer = await prisma.query.retailer({
      where: {
        id: args.sellerId,
      },
    });
    if (belongToRetailer) {
      return saveToRetailer(prisma, args.sellerId, data, args);
    }
    // else {
    //   return saveToManufacturer(args.manufacturerId, data, args);
    // }
  } catch (error) {
    logger.error(`🔴❌  [foxiny-gateway] s3ProfileMediaUploader error`);
    logger.error(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

const s3ProductMediasUploader = async (prisma, upload, userId) => {
  if (!upload) {
    throw new Error("🛑❌  S3PRODUCTMEDIASUPLOADER: NO FILE");
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = upload;

    let readStream;

    if (process.env.NODE_ENV && process.env.NODE_ENV === "testing") readStream = createReadStream;
    else readStream = createReadStream();

    const data = await getFileInfo(filename, userId, createReadStream);

    const key = renameFile(userId, data.name, data.ext); // pattern: userId_tick.extention
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
    logger.error(`🔴❌  [foxiny-gateway] s3ProductMediasUploader error`);
    logger.error(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

/**
 * Upload business profile media to aws s3
 * @param {Object} prisma prisma server
 * @param {Object} upload upload stream
 * @param {Object} args includes sellerId or manufacturerId
 */
const s3DocumentsUploader = async (prisma, upload, args) => {
  if (!upload || args === undefined || !args.sellerId || (args.isBusinessLicense || args.isSocialID) === false) {
    throw new Error("🛑❌  S3DOCUMENTSUPLOADER: NO FILE OR DIRECTORIY");
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = upload;

    let readStream;

    if (process.env.NODE_ENV && process.env.NODE_ENV === "testing") readStream = createReadStream;
    else readStream = createReadStream();

    const data = await getFileInfo(filename, args.sellerId, createReadStream);

    const key = renameFile(args.sellerId, data.name, data.ext); // pattern: userID_tick.extention
    logger.debug(`🔵✅  READ FILE: done. FILE ${key} IS UPLOADING TO S3...`);
    // Upload to S3
    const response = await s3
      .upload({
        Key: `seller/${args.sellerId}/${
          args.isBusinessLicense ? "businessLicense" : args.isSocialID ? "socialID" : "otherDoc"
        }/${key}`,
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
      `UPLOAD_DOCUMENT_MEDIA | ${args.sellerId} | ${data.uri} | ${data.name} | ${data.ext} | ${data.mime} | ${
        data.hash
      } | ${data.sha256} | ${data.size}`,
    );

    return media;
  } catch (error) {
    logger.error(`🔴❌  [foxiny-gateway] s3DocumentUploader error`);
    logger.error(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

export { s3ProfileMediaUploader, s3ProductMediasUploader, s3DocumentsUploader };
