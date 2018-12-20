// @flow

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// TODO: more password rules will be enforced later
const isValidPassword = password => password.length >= 8 && !password.toLowerCase().includes('password');

const hashPassword = password => {
  if (!isValidPassword(password)) {
    throw new Error('Invalid password pattern'); // try NOT to provide enough information so hackers can guess
  }

  return bcrypt.hashSync(password, 12); // length of salt to be generated
};

const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

// synchronous call since no callback supplied
const generateToken = userId => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

const getUserId = (request, requireAuthentication = true) => {
  // 1. Authorization from HTTP Header: http://localhost:4466/foxiny/dev (web/playground)
  // 2. Authorization from Websocket: ws://localhost:4466/foxiny/dev (Jest unit tests)
  const authorization = request
    ? request.headers.authorization // 1.
    : request.connection.context.Authorization; // 2.

  if (authorization) {
    const token = authorization.replace('Bearer ', ''); // remove ther prefix 'Bearer '

    // the verify() will throw Error if the token has been expired
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET); // synchronous call since no callback supplied

      return payload.userId;
    } catch (error) {
      // suppress error if authentication is not required
      if (requireAuthentication) {
        // custom return error message
        throw new Error('Authentication failed'); // invalid token or token expired
      }
    }
  }

  if (requireAuthentication) {
    throw new Error('Authentication required');
  }

  return null;
};

export { hashPassword, verifyPassword, generateToken, getUserId };
