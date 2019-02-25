// @flow

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import logger from './logger';

// TODO: we can stream the file into other cloud services

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * write avatar img
 * @param {String} filename name of file, ex: abc.jpg
 * @param {String} userID id of user account
 * @param {String} fileContent content of file
 */
const saveAvatar = async (filename, userId, createReadStream) => {
  const stream = createReadStream();
  const name = `${userId}_${new Date().getTime()}${path.extname(filename)}`;
  const url = `${process.env.USER_AVATAR_FOLDER}/${name}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated) fs.unlinkSync(url);
        reject(error);
      })
      .pipe(fs.createWriteStream(url))
      .on('error', error => {
        reject(error);
      })
      .on('finish', () => {
        logger.debug(`🆗  Avatar saved: ${url}`);
        resolve({ url: url, name: name });
      }),
  );
};

export { readFile, writeFile };
export { saveAvatar };
