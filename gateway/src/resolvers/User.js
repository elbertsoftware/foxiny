// @flow

import { getUserIDFromRequest } from '../utils/authentication';
import logger from '../utils/logger';

// How to lock down sensitive fields on non-authenticated users
const resolveField = async (parent, request, cache, value) => {
  const userId = await getUserIDFromRequest(request, cache, false); // no need to check for authentication
  logger.debug(`userId ${userId}, parent.id ${parent.id}`);
  if (userId && userId === parent.id) {
    // login user is the same as selecting user (parent)
    return value;
  }

  return null;
};

// fragment is needed to be sure User.id included no matter what the clients ask for it in the selection
const User = {
  email: {
    fragment: 'fragment userIdForEmail on User { id }',

    resolve: (parent, args, { request, cache }) => {
      return resolveField(parent, request, cache, parent.email);
    },
  },

  phone: {
    fragment: 'fragment userIdForPhone on User { id }',
    resolve: (parent, args, { request, cache }) => {
      return resolveField(parent, request, cache, parent.phone);
    },
  },

  password: () => {
    return null; // never show password
  },

  avatar: {
    resolve: (parent, args) => {
      const avatar = parent.avatar.filter(x => x.enabled === true).pop();
      if (avatar) {
        return avatar;
      }
      return {
        id: 'default',
        url: 'user.svg',
        enabled: true,
      };
    },
  },
};

export default User;
