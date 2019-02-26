// @flow

import { getUserIDFromRequest } from '../utils/authentication';
import logger from '../utils/logger';

/**
 * make sure default avatar (user.svg) is always returned if user has no avatar
 * the url is transformed to a full url with protocol, host and directory (/images)
 */

const Avatar = {
  id: {
    resolve: (parent, args, { request }) => {
      return parent.id ? parent.id : 'default';
    },
  },

  url: {
    resolve: async (parent, args, { request }) => {
      const url = `${request.protocol}://${request.get('host')}/images/${parent.url ? parent.url : 'user.svg'}`;
      return url;
    },
  },

  enabled: {
    resolve: (parent, args, { request }) => {
      return !!parent.enabled;
    },
  },
};

export default Avatar;
