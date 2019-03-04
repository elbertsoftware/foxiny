// @flow

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import requestId from 'request-ip';
import cryptoRandomString from 'crypto-random-string';

import logger from './logger';

// TODO: clean expired tokens periodically and automatically
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

const verifyConfirmation = async (cache, code, userId) => {
  const data = JSON.parse(await cache.get(code));

  if (!data) throw new Error('Invalid confirmation code');

  logger.debug(`verifying confirmation code ${code} for userId ${userId} upon the cached userId ${data.userId}`);

  // delete the code after verifying
  cache.del(code);
  logger.debug(`the confirmation code ${code} for userId ${userId} has been deleted from cache`);

  return data.userId === userId && data.emailOrPhone;
};

const saveTokenToCache = (cache, userId, token, data, exp) => {
  // NOTE: this line doesnt set lifetime for token (each key-value pair in one hash store) so I replace with the second one, we will save an object of ip and createdAt time into one key (as a json object)
  // cache.hset(userId, token, JSON.stringify(data), 'EX', exp);
  cache.hset(userId, token, JSON.stringify({ ip: data, createdAt: new Date().getTime() }));
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
  const payload = {
    userId,
    iat: Date.now(),
    // TODO: should contains expiresIn
  };

  // synchronous call since no callback supplied
  const expiresIn = process.env.JWT_EXPIRATION;
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

const getUserIDFromRequest = async (request, cache, requireAuthentication = true) => {
  const token = getTokenFromRequest(request);
  if (token) {
    // the verify() will throw Error if the token has been expired
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET); // synchronous call since no callback supplied
      let { userId } = payload;

      const ip = getRequestIPAddress(request);
      const data = await loadTokenFromCache(cache, userId, token);
      logger.debug(`userId ${userId}, ip ${ip}, cacheIp ${data.ip}, tokenCreatedAt ${Date(data.createdAt)}`);

      let validated = true;

      // check IP address and token lifetime
      if (
        ip !== data.ip ||
        new Date().getTime() > Number(data.createdAt) + Number(process.env.JWT_EXPIRATION) * 60 * 60 * 1000
      ) {
        validated = false;
        // remove expired token
        deleteTokenInCache(cache, userId, token);
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
  generateConfirmation,
  verifyConfirmation,
  generateToken,
  deleteTokenInCache,
  deleteAllTokensInCache,
  getTokenFromRequest,
  getUserIDFromRequest,
};
