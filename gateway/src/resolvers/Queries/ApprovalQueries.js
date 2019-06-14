// @flow

import logger from "../../utils/logger";

export const Query = {
  retailerApprovals: async (parent, { query }, { prisma, request }, info) => {
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

  retailerApprovalProcesses: async (parent, { query }, { prisma, request }, info) => {
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

  lastRetailerApprovalProcess: async (parent, { query }, { prisma, request }, info) => {
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
      opArgs.last = true;
    }

    return prisma.query.approvalProcesses(opArgs, info);
  },
};
