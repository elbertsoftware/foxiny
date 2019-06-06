// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";

export const Mutation = {
  createPermission: async (parent, { data }, { prisma, request, cache, i18n }, info) => {
    const userId = getUserIDFromRequest(request, cache);
    const user = await prisma.query.user({ where: { id: userId } });

    // TODO: check permission
    if (!user) {
      const error = i18n._(t`Access is denied`);
      throw new Error(error);
    }

    // TODO: validate input

    return await prisma.mutation.createRetailer(
      {
        data: {
          ...data,
          enabled: true,
        },
      },
      info,
    );
  },
  updatePermission: async (parent, { data }, { prisma, request, cache }, info) => {},
};
