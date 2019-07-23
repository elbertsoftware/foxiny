// @flow

import _ from "lodash";
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
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_RETAILER_REGISTRATION",
      i18n,
    );

    // TODO: validate input

    const opArgs = {
      orderBy: "updatedAt_DESC",
      skip: query && query.skip ? query.skip : undefined,
      last: query && query.last ? query.last : undefined,
      where: {
        AND: [
          {
            catergory_some: {
              name_contains: "RETAILER_APPROVAL",
            },
          },
        ],
      },
    };

    const or = { OR: [] };
    if (query && query.caseId) {
      or.OR.push({ id: query.caseId });
    }
    if (query && query.severity) {
      or.OR.push({
        severity: {
          name_contains: query.severity,
        },
      });
    }
    if (query && query.status) {
      or.OR.push({
        status: {
          name_contains: query.status,
        },
      });
    }
    if (query && query.targetIds) {
      or.OR.push(
        _.compact(query.targetIds.split(" ")).map(id => ({
          targetIds_contains: id,
        })),
      );
    }
    if (query && query.openedByUserId) {
      or.OR.push({
        openedByUser: {
          id: query.openedByUserId,
        },
      });
    }
    if (query && query.updatedByUserId) {
      or.OR.push({
        updatedByUser_some: {
          id: query.updatedByUserId,
        },
      });
    }
    if (query && query.responsedByStaffUserId) {
      or.OR.push({
        correspondences_some: {
          respondedBy: {
            id: query.responsedByStaffUserId,
          },
        },
      });
    }
    if (or.OR.length > 0) {
      opArgs.where.AND.push(or);
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
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_RETAILER_REGISTRATION",
      i18n,
    );

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
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_RETAILER_REGISTRATION",
      i18n,
    );

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

  productApprovals: async (
    parent,
    { query },
    { prisma, cache, request, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_PRODUCT_REGISTRATION",
      i18n,
    );

    // TODO: validate input

    const opArgs = {
      orderBy: "updatedAt_DESC",
      skip: query && query.skip ? query.skip : undefined,
      last: query && query.last ? query.last : undefined,
      where: {
        AND: [
          {
            catergory_some: {
              name_contains: "PRODUCT_APPROVAL",
            },
          },
        ],
      },
    };

    const or = { OR: [] };
    if (query && query.caseId) {
      or.OR.push({ id: query.caseId });
    }
    if (query && query.severity) {
      or.OR.push({
        severity: {
          name_contains: query.severity,
        },
      });
    }
    if (query && query.status) {
      or.OR.push({
        status: {
          name_contains: query.status,
        },
      });
    }
    if (query && query.status) {
      or.OR.push({
        openedByUser: {
          id: query.openedByUserId,
        },
      });
    }
    if (query && query.status) {
      or.OR.push({
        updatedByUser_some: {
          id: query.updatedByUserId,
        },
      });
    }
    if (query && query.status) {
      or.OR.push({
        correspondences_some: {
          respondedBy: {
            id: query.responsedByStaffUserId,
          },
        },
      });
    }
    if (or.OR.length > 0) {
      opArgs.where.AND.push(or);
    }

    return prisma.query.supportCases(opArgs, info);
  },
};
