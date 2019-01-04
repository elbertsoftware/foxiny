// @flow

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import requestId from 'request-ip';
import logger from './logger';

// TODO: more password rules will be enforced later
const isValidPassword = password => password.length >= 8 && !password.toLowerCase().includes('password');

const hashPassword = password => {
  if (!isValidPassword(password)) {
    throw new Error('Invalid password pattern'); // try NOT to provide enough information so hackers can guess
  }

  return bcrypt.hashSync(password, 12); // length of salt to be generated
};

const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

const getRequestIPAddress = request => requestId.getClientIp(request);

const saveTokenToCache = (cache, userId, token, data, exp) => {
  cache.hset(userId, token, JSON.stringify(data), 'EX', exp);
};

const loadTokenFromCache = async (cache, userId, token) => {
  const data = await cache.hget(userId, token);
  return JSON.parse(data);
};

const deleteTokenInCache = (cache, userId, token) => {
  logger.debug(`removing token ${token} on userId ${userId}`);
  cache.hdel(userId, token);
};

const deleteAllTokensInCache = (cache, userId) => {
  logger.debug(`removing all tokens on userId ${userId}`);
  cache.del(userId);
};

const generateToken = (userId, request, cache) => {
  const expiresIn = process.env.JWT_EXPIRATION;

  const iat = Date.now();
  const exp = ms(expiresIn);

  const payload = {
    userId,
    iat,
  };

  // synchronous call since no callback supplied
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  const ip = getRequestIPAddress(request);

  // save token to redis cache
  saveTokenToCache(cache, userId, token, ip, exp);

  return token;
};

const getTokenFromRequest = request => {
  // 1. Authorization from HTTP Header: http://localhost:4466/foxiny/dev (web/playground)
  // 2. Authorization from Websocket: ws://localhost:4466/foxiny/dev (Jest unit tests)
  const authorization = request
    ? request.headers.authorization // 1.
    : request.connection.context.Authorization; // 2.

  // remove ther prefix 'Bearer '
  const token = authorization ? authorization.replace('Bearer ', '') : null;
  logger.debug(`authorization token ${token}`);

  return token;
};

const getUserIDFromRequest = async (request, cache, requireAuthentication = true) => {
  const token = getTokenFromRequest(request);
  if (token) {
    // the verify() will throw Error if the token has been expired
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET); // synchronous call since no callback supplied
      let { userId } = payload;

      const ip = getRequestIPAddress(request);
      const cacheIp = await loadTokenFromCache(cache, userId, token);
      logger.debug(`userId ${userId}, ip ${ip}, cacheIp ${cacheIp}`);

      let validated = true;
      if (ip !== cacheIp) {
        // check IP address
        validated = false;
      }

      // more validation goes here
      // ...

      if (!validated) {
        userId = null; // clear the userId since the token is actually invalid

        // suppress error if authentication is not required
        if (requireAuthentication) {
          throw new Error('Authentication required'); // invalid token
        }
      }

      return userId;
    } catch (error) {
      // suppress error if authentication is not required
      if (requireAuthentication) {
        throw new Error('Authentication required'); // invalid token or token expired
      }
    }
  }

  if (requireAuthentication) {
    throw new Error('Authentication required'); // custom return error message
  }

  return null;
};

export {
  hashPassword,
  verifyPassword,
  generateToken,
  deleteTokenInCache,
  deleteAllTokensInCache,
  getTokenFromRequest,
  getUserIDFromRequest,
};
