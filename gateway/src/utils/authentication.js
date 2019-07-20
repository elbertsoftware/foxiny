// @flow
import { t } from '@lingui/macro';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import requestId from 'request-ip';
import cryptoRandomString from 'crypto-random-string';

import logger from './logger';

// TODO: clean expired tokens periodically and automatically
// TODO: more password rules will be enforced later

const isValidPassword = password => password.length >= 8 && !password.toLowerCase().includes('password'); // repkace by the new one in validation.js

const hashPassword = password => {
  // if (!isValidPassword(password)) {
  //   throw new Error('Invalid password pattern'); // try NOT to provide enough information so hackers can guess
  // }

  return bcrypt.hashSync(password, 12); // length of salt to be generated
};

const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

const getRequestIPAddress = request => requestId.getClientIp(request);

const generateConfirmation = (cache, userId, emailOrPhone) => {
  const code = cryptoRandomString(parseInt(process.env.CONFIRMATION_LENGTH, 10));
  logger.debug(`generated new confirmation code ${code} for userId ${userId}`);

  cache.set(
    code,
    JSON.stringify({ userId: userId, emailOrPhone: emailOrPhone }),
    'EX',
    ms(process.env.CONFIRMATION_EXPIRATION) / 1000,
  ); // convert to seconds
  return code;
};

const verifyConfirmation = async (cache, code, userId, i18n) => {
  const data = JSON.parse(await cache.get(code));

  if (!data) {
    const error = i18n._(t`Invalid confirmation code`);
    throw new Error(error);
  }

  logger.debug(`verifying confirmation code ${code} for userId ${userId} upon the cached userId ${data.userId}`);

  // delete the code after verifying
  cache.del(code);
  logger.debug(`the confirmation code ${code} for userId ${userId} has been deleted from cache`);

  return data.userId === userId && data.emailOrPhone;
};

const saveTokenToCache = (cache, userId, token, data, exp) => {
  // NOTE: the line below doesnt set lifetime for token (each key-value pair in one hashset) so I replace with the second one, we will save an object of only ip
  // cache.hset(userId, token, JSON.stringify(data), 'EX', exp);

  cache.hset(userId, token, JSON.stringify({ ip: data }));
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

const generateToken = (userId, request, cache, options = null) => {
  const payload = {
    userId,
    // iat: Date.now(), // NOTE: claimed by default
  };

  // NOTE: options (object) is used for test or other reasons
  // synchronous call since no callback supplied
  const expiresIn = options && options.expiresIn ? options.expiresIn : process.env.JWT_EXPIRATION;
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  const ip = getRequestIPAddress(request);

  // save token to redis cache
  saveTokenToCache(cache, userId, token, ip, ms(expiresIn) / 1000); // convert to seconds

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

const getUserIDFromRequest = async (request, cache, i18n, requireAuthentication = true, options = null) => {
  const token = getTokenFromRequest(request);
  if (token) {
    // the verify() will throw Error if the token has been expired
    try {
      const expiresIn = options && options.expiresIn ? options.expiresIn : process.env.JWT_EXPIRATION;
      // NOTE: add the verifyOoptions (expiresIn): same as the signOptions in generateToken (jwt needs it for checking token's lifetime)
      const payload = jwt.verify(token, process.env.JWT_SECRET, { expiresIn }); // synchronous call since no callback supplied
      let { userId } = payload;

      const ip = getRequestIPAddress(request);
      const data = await loadTokenFromCache(cache, userId, token);
      logger.debug(`userId ${userId}, ip ${ip}, cacheIp ${data.ip}`);

      let validated = true;

      // check IP address and token lifetime
      if (ip !== data.ip) {
        validated = false;
      }

      // more validation goes here
      // ...

      if (!validated) {
        userId = null; // clear the userId since the token is actually invalid

        // suppress error if authentication is not required
        if (requireAuthentication) {
          const error = i18n._(t`Authentication required`);
          throw new Error(error); // invalid token
        }
      }

      return userId;
    } catch (error) {
      // suppress error if authentication is not required
      if (requireAuthentication) {
        const error = i18n._(t`Authentication required`);
        throw new Error(error); // invalid token or token expired
      }
    }
  }

  if (requireAuthentication) {
    const error = i18n._(t`Authentication required`);
    throw new Error(error); // custom return error message
  }

  return null;
};

// use this function in each time user login, this will scan all key in user's hashed-set, remove the expired tokens
/**
 * Scan and remove expired tokens of one user
 * @param {String} userId id of user
 * @param {Object} cache redis instance
 */
const cleanToken = async (userId, cache) => {
  // get all token from userId hset
  const allTokens = await cache.hgetall(userId);

  // check each token and delete if expired
  for (let token in allTokens) {
    const payload = jwt.decode(token);
    // NOTE: jwt token iat takes the unix timestamp in second, convert it to ms before compare to now
    if (payload.exp * 1000 < Date.now()) {
      logger.debug(`Token ${token} is expired. This will be removed.`);
      deleteTokenInCache(cache, userId, token);
    }
  }
};

export {
  hashPassword,
  verifyPassword,
  generateConfirmation,
  verifyConfirmation,
  generateToken,
  deleteTokenInCache,
  deleteAllTokensInCache,
  getTokenFromRequest,
  getUserIDFromRequest,
  cleanToken,
};
