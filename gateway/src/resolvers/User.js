// @flow

import { getUserIDFromRequest } from '../utils/authentication';
import logger from '../utils/logger';

// How to lock down sensitive fields on non-authenticated users
const resolveField = async (parent, request, cache, value) => {
  const userId = await getUserIDFromRequest(request, cache, false); // no need to check for authentication
  logger.debug(`🔷  userId ${userId}, parent.id ${parent.id}`);
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

  // if user has not set avatar yet, return default
  profileMedia: {
    resolve: (parent, args, { request, cache }) => {
      return {
        id: parent.profileMedia ? parent.profileMedia.id : 'default',
        _version: parent.profileMedia ? parent.profileMedia._version : 'default',

        name: parent.profileMedia ? parent.profileMedia.name : process.env.DEFAULT_USER_PROFILE_MEDIA_NAME,
        ext: parent.profileMedia ? parent.profileMedia.ext : process.env.DEFAULT_USER_PROFILE_MEDIA_EXT,
        mime: parent.profileMedia ? parent.profileMedia.mime : process.env.DEFAULT_USER_PROFILE_MEDIA_MIME,
        size: parent.profileMedia ? parent.profileMedia.size : Number(process.env.DEFAULT_USER_PROFILE_MEDIA_SIZE), // in bytes
        hash: parent.profileMedia ? parent.profileMedia.hash : 'default',
        sha256: parent.profileMedia ? parent.profileMedia.sha256 : 'default',
        uri: parent.profileMedia ? parent.profileMedia.uri : process.env.DEFAULT_USER_PROFILE_MEDIA_URI,
        createdAt: parent.profileMedia ? parent.profileMedia.createdAt : 'default',
        updatedAt: parent.profileMedia ? parent.profileMedia.updatedAt : 'default',
      };
    },
  },
};

export default User;
