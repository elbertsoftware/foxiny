// @flow

import { t } from "@lingui/macro";
import { addFragmentToInfo } from "graphql-binding";
import logger from "../../utils/logger";
import { sendCorrespondence } from "../../utils/email";
import { getUserIDFromRequest } from "../../utils/authentication";
import { checkStaffPermission } from "../../utils/permissionChecker";
// TODO: log transactions

export const Mutation = {
  createRetailerApprovalProcess: async (
    parent,
    { data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permissions
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // await checkStaffPermission(prisma, cache, request, i18n, ["ADMINISTRATOR"])
    // TODO: validate input

    const newData = data;

    const retailerUsers = await prisma.query.users({
      where: {
        assignment: {
          retailers_some: {
            id: newData.retailerId,
          },
        },
      },
    });

    let approval = await prisma.query.supportCases(
      {
        where: {
          openByUser: {
            id: retailerUsers[0].id,
          },
          catergory: {
            name: "CREATE_RETAILER_APPROVAL",
          },
          retailerId: newData.retailerId,
        },
        last: 1,
      },
      `{ id status { name } }`,
    );

    if (approval.length > 0) {
      approval = approval.pop();
    }

    if (approval.length === 0 || approval.status.name === "CLOSED") {
      approval = await prisma.mutation.createSupportCase({
        data: {
          subject: newData.subject ? newData.subject : "New Retailer Approval",
          caseType: {
            connect: {
              name: "Retailer Account",
            },
          },
          status: {
            connect: {
              name: "OPEN",
            },
          },
          severity: {
            connect: {
              name: "MEDIUM",
            },
          },
          catergory: {
            connect: {
              name: "CREATE_RETAILER_APPROVAL",
            },
          },
          openByUser: {
            connect: {
              id: retailerUsers[0].id,
            },
          },
          retailerId: newData.retailerId,
        },
      });
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
              id: userId,
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
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // TODO: validate input
    const newData = data;

    let approval = await prisma.query.supportCases({
      where: {
        catergory: {
          name: "CREATE_RETAILER_APPROVAL",
        },
        retailerId: newData.retailerId,
      },
      last: 1,
    });

    const retailer = await prisma.query.retailer({
      where: {
        id: newData.retailerId,
      },
    });

    if (approval.length > 0) {
      approval = approval.pop();
      if (!approval || approval.isClosed) {
        ``;
        const error = i18n.t`Approval is closed`;
        throw new Error(error);
      }
      if (!retailer || retailer.enabled === true) {
        const error = i18n.t`Retailer not found or disabled`;
        throw new Error(error);
      }
    } else {
      const error = i18n.t`Approval does not exist`;
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
            name: "APPROVED",
          },
        },
        correspondence: {
          create: {
            data: newData.data,
            note: newData.note,
            respondedBy: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });

    return prisma.mutation.updateRetailer(
      {
        where: {
          id: newData.retailerId,
        },
        data: {
          enabled: true,
        },
      },
      info,
    );
  },

  disapproveRetailer: async (
    parent,
    { data },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // TODO: validate input
    const newData = data;

    let approval = await prisma.query.supportCases({
      where: {
        catergory: {
          name: "CREATE_RETAILER_APPROVAL",
        },
        retailerId: newData.retailerId,
      },
      last: 1,
    });

    const retailer = await prisma.query.retailer({
      where: {
        id: newData.retailerId,
      },
    });

    if (approval.length > 0) {
      approval = approval.pop();
      if (!approval || approval.isClosed) {
        const error = i18n.t`Approval is closed`;
        throw new Error(error);
      }
      if (!retailer || retailer.enabled === true) {
        const error = i18n.t`Retailer not found or disabled`;
        throw new Error(error);
      }
    } else {
      const error = i18n.t`Approval does not exist`;
      throw new Error(error);
    }

    // save last record, close support case
    const supportCase = await prisma.mutation.updateSupportCase(
      {
        where: {
          id: approval.id,
        },
        data: {
          correspondence: {
            create: {
              data: newData.data,
              note: newData.note,
              respondedBy: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      },
      "{ openByUser { email } }",
    );

    const updatedRetailer = await prisma.mutation.updateRetailer(
      {
        where: {
          id: newData.retailerId,
        },
        data: {
          enabled: false,
        },
      },
      info,
    );

    await sendCorrespondence(
      updatedRetailer.businessName,
      supportCase.openByUser.email,
      newData.note,
    );

    return updatedRetailer;
  },

  deleteRetailer: async (
    parent,
    { sellerId },
    { prisma, request, cache, i18n },
    info,
  ) => {
    // TODO: check permission
    const userId = await getUserIDFromRequest(request, cache, i18n);
    // TODO: validate input

    const retailer = await prisma.query.retailer({
      where: {
        id: sellerId,
      },
    });
    // TODO: if retailer sells any goods, deletion is denied
    if (!retailer || retailer.enabled === true) {
      const error = i18n.t`Cannot delete retailer`;
      throw new Error(error);
    }

    return prisma.mutation.deleteRetailer({
      where: {
        id: sellerId,
      },
    });
  },
};
