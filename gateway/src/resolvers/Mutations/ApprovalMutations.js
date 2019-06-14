// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";
import { checkStaffPermission } from "../../utils/permissionChecker";

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

    console.log(JSON.stringify(newData, undefined, 2));

    let approval = await prisma.query.approval({
      where: {
        sellerId: newData.retailerId,
      },
    });

    if (approval && approval.status === "CLOSED") {
      const error = i18n.t`Approval is closed`;
      throw new Error(error);
    }

    if (!approval) {
      approval = await prisma.mutation.createApproval({
        data: {
          sellerId: newData.retailerId,
          type: "RETAILER",
          isClosed: false,
        },
      });
    }

    return prisma.mutation.createApprovalProcess(
      {
        data: {
          createdBy: {
            connect: {
              id: userId,
            },
          },
          approval: {
            connect: {
              id: approval.id,
            },
          },
          processData: newData.processData,
        },
      },
      info,
    );
  },
};
