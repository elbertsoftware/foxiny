// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";

export const Query = {
  retailerApprovals: async (
    parent,
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // TODO: validate input
    const newData = query;

    const opArgs = {};
    if (newData) {
      opArgs.where = {
        OR: [
          {
            openByUser: {
              id: userId,
            },
          },
          {
            retailerId: newData.retailerId,
          },
          {
            openByUser: {
              id: newData.userId,
            },
          },
          {
            status: {
              name: newData.status,
            },
          },
        ],
      };
    }
    if (newData.last) {
      opArgs.last = newData.last;
    }

    return prisma.query.supportCases(opArgs, info);
  },

  retailerApprovalProcesses: async (
    parent,
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // TODO: validate input
    const newData = query;
    const opArgs = {};

    if (newData) {
      opArgs.where = {
        OR: [
          {
            supportCase: {
              openByUser: {
                id: userId,
              },
            },
          },
          {
            respondedBy: {
              id: userId,
            },
          },
          {
            supportCase: {
              retailerId: newData.retailerId,
            },
          },
          {
            supportCase: {
              manufacturerId: newData.manufacturerId,
            },
          },
          {
            supportCase: {
              status: {
                name: newData.status,
              },
            },
          },
        ],
      };
    }
    if (newData.last) {
      opArgs.last = newData.last;
    }

    return prisma.query.supportCorrespondences(opArgs, info);
  },

  // TODO: how 'bout wrong seller ID?
  lastRetailerApprovalProcess: async (
    parent,
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // TODO: validate input
    const newData = query;
    const opArgs = {};

    if (newData) {
      opArgs.where = {
        OR: [
          {
            supportCase: {
              openByUser: {
                id: userId,
              },
            },
          },
          {
            respondedBy: {
              id: userId,
            },
          },
          {
            supportCase: {
              retailerId: newData.retailerId,
            },
          },
          {
            supportCase: {
              manufacturerId: newData.manufacturerId,
            },
          },
          {
            supportCase: {
              status: {
                name: newData.status,
              },
            },
          },
        ],
      };
    }

    opArgs.last = 1;

    return prisma.query.supportCorrespondences(opArgs, info);
  },
};
