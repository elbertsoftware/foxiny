// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";
import { gatekeeper } from "../../utils/permissionChecker";

export const Mutation = {
  createRole: async (parent, args, { prisma, request, cache, i18n }, info) => {
    // NOTE: check permissions
    const user = await gatekeeper.checkPermissions(request, "SYSTEM", i18n);

  },
};
