// @flow

import { getUserIDFromRequest } from '../../utils/authentication';
import logger from '../../utils/logger';

/**
 * make sure default avatar (user.svg) is always returned if user has not set avatar yet
 */

export const Media = {
  // id: {
  //   resolve: (parent, args, { request }) => {
  //     return parent.id;
  //   },
  // },

  // name: {
  //   resolve: (parent, args, { request }) => {
  //     return parent.name;
  //   },
  // },

  // ext: {
  //   resolve: (parent, args, { request }) => {
  //     return parent.ext;
  //   },
  // },

  // size: {
  //   resolve: (parent, args, { request }) => {
  //     return parent.size;
  //   },
  // },

  // uri: {
  //   resolve: (parent, args, { request }) => {
  //     return parent.uri;
  //   },
  // },

  hash: {
    resolve: (parent, args, { request }) => null,
  },

  sha256: {
    resolve: (parent, args, { request }) => null,
  },
};
