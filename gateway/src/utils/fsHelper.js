// @flow

import fs from "fs";
import path from "path";
import crypto from "crypto";
import logger from "./logger";

/**
 * return an object contains uri, name, extension, filesize, hash by md5 and sha256
 * @param {String} filename name of file, ex: abc.jpg
 * @param {String} userID id of user account
 * @param {String} fileContent content of file
 */
const getFileInfo = async (filename, userId, createReadStream) => {
  let readStream;

  // for testing
  if (process.env.NODE_ENV && process.env.NODE_ENV === "testing") readStream = createReadStream;
  else readStream = createReadStream();

  const ext = path.extname(filename).replace(".", ""); // file's extension ex: jpg, gif, tiff...
  const name = path.basename(filename, ext); // pattern: userID_tick.extention
  const md5 = crypto.createHash("md5"); // md5 hasher instance
  const sha256 = crypto.createHash("sha256"); // sha256 hasher instance
  let size = 0;

  return new Promise((resolve, reject) =>
    readStream
      // .on('error', error => {
      //   if (stream.truncated) fs.unlinkSync(uri);
      //   reject(error);
      // }) // throw error if stream has something wrong
      .on("data", data => {
        md5.update(data);
        sha256.update(data);
        size += data.length;
      }) // update hash
      // .pipe(fs.createWriteStream(uri)) // pipe to a writestream
      .on("error", error => {
        reject(error);
      }) // throw error if writestream has something wrong
      .on("end", () => {
        const md5ed = md5.digest("hex");
        const sha256ed = sha256.digest("hex");
        logger.debug(`🔷  Hash of file is ${name} - ${size}bytes | md5: ${md5ed} | sha256: ${sha256ed}`);
        resolve({ name: name, ext: ext, size: size, hash: md5ed, sha256: sha256ed });
      }),
  );
};

export { getFileInfo };
