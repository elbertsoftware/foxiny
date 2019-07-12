// @flow

import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { gatekeeper } from "../../utils/permissionChecker";

// TODO: something wrong in these queries
export const Query = {
  retailerApprovals: async (
    parent,
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(request, "SUPPORT", i18n);

    // TODO: validate input

    const opArgs = {
      orderBy: "updatedAt_DESC",
      skip: query.skip || undefined,
      last: query.last || undefined,
      where: {
        OR: [
          { id: query.caseId || undefined },
          {
            severity: {
              name_contains: query.severity,
            },
          },
          {
            status: {
              name_contains: query.status,
            },
          },
          {
            openedByUser: {
              id: query.openedByUserId,
            },
          },
          {
            updatedByUser_some: {
              id: updatedByUserId,
            },
          },
          {
            correspondences_some: {
              respondedBy: {
                id: query.responsedByStaffUserId,
              },
            },
          },
        ],
      },
    };

    return prisma.query.supportCases(opArgs, info);
  },

  retailerApprovalProcesses: async (
    parent,
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(request, "SUPPORT", i18n);

    // TODO: validate input

    const opArgs = {
      orderBy: "updatedAt_DESC",
      where: {
        OR: [
          {
            supportCase: {
              id: query.caseId,
            },
          },
        ],
      },
    };

    return prisma.query.supportCorrespondences(opArgs, info);
  },

  // TODO: how 'bout wrong seller ID?
  lastRetailerApprovalProcess: async (
    parent,
    { caseId },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(request, "SUPPORT", i18n);

    // TODO: validate input

    const opArgs = {
      orderBy: "updatedAt_DESC",
      last: 1,
      where: {
        OR: [
          {
            supportCase: {
              id: query.caseId,
            },
          },
        ],
      },
    };

    return prisma.query.supportCorrespondences(opArgs, info);
  },
};
