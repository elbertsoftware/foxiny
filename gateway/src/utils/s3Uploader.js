import AWS from 'aws-sdk';
import { saveProfileMedia } from './fsHelper';
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

const s3Uploader = async (prisma, upload, userId) => {
  if (!upload) {
    throw new Error('🛑❌  S3UPLOADER: NO FILE');
  }
  try {
    const { createReadStream, filename, mimetype, encoding } = await upload;
    const readStream = createReadStream();

    const data = await saveProfileMedia(filename, userId, createReadStream);

    const key = `${userId}_${new Date().getTime()}.${data.ext}`; // pattern: userID_tick.extention

    logger.debug(`🔵✅  READ FILE: done. UPLOADING to S3...`);
    // Upload to S3
    const response = await s3
      .upload({
        Key: `images/${key}`,
        ACL: `public-read`,
        Body: readStream,
      })
      .promise();

    data.uri = response.Location;
    logger.debug(`🔵✅  UPLOADED to S3: file location ${data.uri}`);

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

    return updatedUser.profileMedia;
  } catch (error) {
    logger.info(`[foxiny-gateway] s3Uploader error`);
    logger.info(JSON.stringify(error, undefined, 2));
    throw new Error(`Cannot upload file`);
  }
};

export { s3Uploader };
