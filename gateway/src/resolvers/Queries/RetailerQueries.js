// @flow

import { getUserIDFromRequest } from '../../utils/authentication';
import logger from '../../utils/logger';

export const Query = {
  retailers: (parent, { query }, { prisma, request }, info) => {
    const opArgs = {};
    if (query) {
      opArgs.where = {
        OR: [
          { id: query },
          { businessName: query },
          { phone: query },
        ]
      }
    }

    return prisma.query.retailers(opArgs, info);
  }
}