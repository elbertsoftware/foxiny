import AWS from 'aws-sdk';
import { saveProfileMedia } from './fsHelper';
import logger from './logger';

AWS.config.update({
  accessKeyId: 'AKIAIWZ5NK2GRKDZQNMQ',
  secretAccessKey: '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',
  region: 'ap-southeast-1',
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: `dohuta`,
  },
});

const s3Uploader = async (prisma, upload, userId) => {
  logger.debug(JSON.stringify(await upload, undefined, 2));
  if (!upload) {
    throw new Error('🛑❌  S3UPLOADER: NO FILE');
  }

  const { createReadStream, filename, mimetype, encoding } = await upload;
  const readStream = createReadStream();

  const data = await saveProfileMedia(filename, userId, createReadStream);

  logger.debug(`🔷 File after read:`);
  logger.debug(JSON.stringify(data, undefined, 2));

  const key = `${userId}_${new Date().getTime()}.${data.ext}`; // pattern: userID_tick.extention

  // Upload to S3
  const response = await s3
    .upload({
      Key: `images/${key}`,
      ACL: `public-read`,
      Body: readStream,
    })
    .promise();

  logger.debug('S3 Uploaded');
  logger.debug(JSON.stringify(response));
  data.uri = response.Location;

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
};

export { s3Uploader };
