// @flow

import { getUserIDFromRequest } from '../utils/authentication';
import logger from '../utils/logger';

/**
 * make sure default avatar (user.svg) is always returned if user has no avatar
 * the url is transformed to a full url with protocol, host and directory (/images)
 */

const Media = {
  id: {
    resolve: (parent, args, { request }) => {
      if (!parent.id) return 'default';
      return parent.id;
    },
  },

  name: {
    resolve: (parent, args, { request }) => {
      if (!parent.name) return 'default;';
      return parent.name;
    },
  },

  ext: {
    resolve: (parent, args, { request }) => {
      if (!parent.ext) return 'svg';
      return parent.ext;
    },
  },

  size: {
    resolve: (parent, args, { request }) => {
      if (!parent.size) return 1085;
      return parent.size;
    },
  },

  hash: {
    resolve: (parent, args, { request }) => null,
  },

  sha256: {
    resolve: (parent, args, { request }) => null,
  },

  uri: {
    resolve: (parent, args, { request }) => {
      const uri = `${request.protocol}://${request.get('host')}/images/${
        parent.uri ? parent.uri.replace('./', '') : 'user.svg'
      }`;
      return uri;
    },
  },
};

export default Media;
