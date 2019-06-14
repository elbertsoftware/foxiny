// @flow

import logger from '../../utils/logger';
import { getUserIDFromRequest } from '../../utils/authentication';

export const Query = {
  retailerApprovals: async (parent, { query }, { prisma, cache, request, i18n }, info) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            sellerId: query,
          },
        ],
      };
    }

    return prisma.query.approvals(opArgs, info);
  },

  retailerApprovalProcesses: async (parent, { query }, { prisma, cache, request, i18n }, info) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            approval: {
              sellerId: query,
            },
          },
        ],
      };
    }

    return prisma.query.approvalProcesses(opArgs, info);
  },

  // TODO: how 'bout wrong seller ID?
  lastRetailerApprovalProcess: async (parent, { query }, { prisma, cache, request, i18n }, info) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            approval: {
              sellerId: query,
            },
          },
        ],
      };
      opArgs.last = 1;
    } else {
      return [];
    }

    const approvalProcess = await prisma.query.approvalProcesses(opArgs, info);
    return approvalProcess.pop() || null;
  },
};
