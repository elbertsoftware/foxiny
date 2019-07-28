// @flow

import redis from "redis";
import util from "util";

import logger from "./logger";

const cache = redis.createClient(process.env.REDIS_ENDPOINT);

// convert callback style methods to promise where async/await applied
cache.get = util.promisify(cache.get);
cache.hget = util.promisify(cache.hget);
cache.hgetall = util.promisify(cache.hgetall).bind(cache); // Get all fields and values of the key
cache.flushall = util.promisify(cache.flushall); // Delete all the keys of all the existing databases

cache.on("error", error =>
  logger.error(`🚫  foxiny-cache errored out: ${error}`),
);

export default cache;
