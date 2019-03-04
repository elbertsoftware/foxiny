// @flow

import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import path from 'path';
import logger from './logger';

// TODO: we can stream the file into other cloud services

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * write avatar img and return an object contains uri, name, extension, filesize, hash by md5 and sha256
 * @param {String} filename name of file, ex: abc.jpg
 * @param {String} userID id of user account
 * @param {String} fileContent content of file
 */
const saveProfileMedia = async (filename, userId, createReadStream) => {
  const readStream = createReadStream();
  const ext = path.extname(filename).replace('.', ''); // file's extension ex: jpg, gif, tiff...
  const name = `${userId}_${new Date().getTime()}.${ext}`; // pattern: userID_tick.extention
  const md5 = crypto.createHash('md5'); // md5 hasher instance
  const sha256 = crypto.createHash('sha256'); // sha256 hasher instance
  let size = 0;
  return new Promise((resolve, reject) =>
    readStream
      // .on('error', error => {
      //   if (stream.truncated) fs.unlinkSync(uri);
      //   reject(error);
      // }) // throw error if stream has something wrong
      .on('data', data => {
        md5.update(data);
        sha256.update(data);
        size += data.length;
      }) // update hash
      // .pipe(fs.createWriteStream(uri)) // pipe to a writestream
      .on('error', error => {
        reject(error);
      }) // throw error if writestream has something wrong
      .on('end', () => {
        const md5ed = md5.digest('hex');
        const sha256ed = sha256.digest('hex');
        logger.debug(`🔷  Hash of file ${name} - ${size}bytes is md5: ${md5ed} | sha256: ${sha256ed}`);
        resolve({ name: name, ext: ext, size: size, hash: md5ed, sha256: sha256ed });
      }),
  );
};

export { readFile, writeFile };
export { saveProfileMedia };
