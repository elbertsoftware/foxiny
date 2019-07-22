// @flow

import { t } from "@lingui/macro";
import { addFragmentToInfo } from "graphql-binding";
import logger from "../../utils/logger";
import { sendCorrespondence } from "../../utils/email";
import { gatekeeper } from "../../utils/permissionChecker";

// TODO: log transactions

export const Mutation = {
  /**
   * delete user
   */
  deleteUser: async (parent, args, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permissions
    const user = await gatekeeper.checkPermissions(
      request,
      "DELETE_SELLER",
      i18n,
    );

    deleteAllTokensInCache(cache, user.id);

    logger.info(`DELETE_USER | 1 | ${user.id}`);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: user.id,
        },
      },
      info,
    );
  },

  createRetailerApprovalProcess: async (
    parent,
    { data },
    { prisma, request, cache, i18n, gatekeeper },
    info,
  ) => {
    // TODO: check permissions
    const user = await gatekeeper.checkPermissions(
      request,
      "CREATE_RETAILER_APPROVAL_PROCESS",
      i18n,
    );

    // TODO: validate input
    const newData = data;

    const approval = await prisma.query.supportCase(
      {
        where: {
          id: newData.caseId,
        },
      },
      "{ id status { name } }",
    );

    if (!approval.status.name === "CLOSED") {
      const error = i18n._(`Approval not found or closed`);
      throw new Error(error);
    }

    return prisma.mutation.createSupportCorrespondence(
      {
        data: {
          note: newData.note,
          data: newData.data,
          supportCase: {
            connect: {
              id: approval.id,
            },
          },
          respondedBy: {
            connect: {
              id: user.id,
            },
          },
        },
      },
      info,
    );
  },

  approveRetailer: async (
    parent,
    { data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permissions
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_RETAILER_REGISTRATION",
      i18n,
    );

    // TODO: validate input
    const newData = data;

    const approval = await prisma.query.supportCase(
      {
        where: {
          id: newData.caseId,
        },
      },
      "{ id status { name } targetIds }",
    );
    console.log(approval, undefined, 2);
    if (approval.status.name === "CLOSED") {
      const error = i18n._(`Approval not found or closed`);
      throw new Error(error);
    }

    // save last record, close support case
    await prisma.mutation.updateSupportCase({
      where: {
        id: approval.id,
      },
      data: {
        status: {
          connect: {
            name: "CLOSED",
          },
        },
        correspondences: {
          create: {
            data: newData.data,
            note: newData.note,
            respondedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    const updated = await prisma.mutation.updateManyRetailers({
      where: {
        id_in: approval.targetIds.split(","),
      },
      data: {
        enabled: true,
      },
    });

    return updated.count;
  },

  disapproveRetailer: async (
    parent,
    { data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      "DISAPPROVE_RETAILER_REGISTRATION",
      i18n,
    );

    // TODO: validate input
    const newData = data;

    const approval = await prisma.query.supportCase(
      {
        where: {
          id: newData.caseId,
        },
      },
      "{ id status { name } targetIds }",
    );

    if (!approval.status.name === "CLOSED") {
      const error = i18n._(`Approval not found or closed`);
      throw new Error(error);
    }

    // save last record, close support case
    const supportCase = await prisma.mutation.updateSupportCase({
      where: {
        id: approval.id,
      },
      data: {
        correspondences: {
          create: {
            data: newData.data,
            note: newData.note,
            respondedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    const updated = await prisma.mutation.updateManyRetailers({
      where: {
        id: approval.targetIds.split(","),
      },
      data: {
        enabled: false,
      },
    });
    return updated.count;
  },

  // FIXME: ???
  deleteRetailer: async (
    parent,
    { sellerId },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      "DELETE_SELLER",
      i18n,
    );

    // TODO: validate input

    const retailer = await prisma.query.retailer({
      where: {
        id: sellerId,
      },
    });

    // TODO: if retailer sells any goods, deletion is denied
    if (!retailer || retailer.enabled === true) {
      const error = i18n._`Cannot delete retailer`;
      throw new Error(error);
    }

    return prisma.mutation.deleteRetailer({
      where: {
        id: sellerId,
      },
    });
  },

  createProductApprovalProcess: async (
    parent,
    { data },
    { prisma, request, cache, i18n, gatekeeper },
    info,
  ) => {
    // TODO: check permissions
    const user = await gatekeeper.checkPermissions(
      request,
      "CREATE_PRODUCT_APPROVAL_PROCESS",
      i18n,
    );

    // TODO: validate input
    const newData = data;

    const approval = await prisma.query.supportCase(
      {
        where: {
          id: newData.caseId,
        },
      },
      "{ id status { name } }",
    );

    if (!approval.status.name === "CLOSED") {
      const error = i18n._(`Approval not found or closed`);
      throw new Error(error);
    }

    return prisma.mutation.createSupportCorrespondence(
      {
        data: {
          note: newData.note,
          data: newData.data,
          supportCase: {
            connect: {
              id: approval.id,
            },
          },
          respondedBy: {
            connect: {
              id: user.id,
            },
          },
        },
      },
      info,
    );
  },

  approveProducts: async (
    parent,
    { data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permissions
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_PRODUCT_REGISTRATION",
      i18n,
    );

    // TODO: validate input
    const newData = data;

    const approval = await prisma.query.supportCase(
      {
        where: {
          id: newData.caseId,
        },
      },
      "{ id status { name } targetIds }",
    );

    if (!approval.status.name === "CLOSED") {
      const error = i18n._(`Approval not found or closed`);
      throw new Error(error);
    }

    // save last record, close support case
    await prisma.mutation.updateSupportCase({
      where: {
        id: approval.id,
      },
      data: {
        status: {
          connect: {
            name: "CLOSED",
          },
        },
        correspondences: {
          create: {
            data: newData.data,
            note: newData.note,
            respondedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    const updated = await prisma.mutation.updateManyProductRetailers({
      where: {
        id_in: approval.targetIds.split(","),
      },
      data: {
        enabled: true,
      },
    });
    return updated.count;
  },

  disapproveProducts: async (
    parent,
    { data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permission
    const user = await gatekeeper.checkPermissions(
      request,
      "DAPPROVE_PRODUCT_REGISTRATION",
      i18n,
    );

    // TODO: validate input
    const newData = data;

    const approval = await prisma.query.supportCase(
      {
        where: {
          id: newData.caseId,
        },
      },
      "{ id status { name } targetIds }",
    );

    if (!approval.status.name === "CLOSED") {
      const error = i18n._(`Approval not found or closed`);
      throw new Error(error);
    }

    // save last record, close support case
    const supportCase = await prisma.mutation.updateSupportCase({
      where: {
        id: approval.id,
      },
      data: {
        correspondences: {
          create: {
            data: newData.data,
            note: newData.note,
            respondedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    const updated = await prisma.mutation.updateManyProductRetailers({
      where: {
        id: approval.targetIds.split(","),
      },
      data: {
        enabled: false,
      },
    });
    return updated.count;
  },
};
