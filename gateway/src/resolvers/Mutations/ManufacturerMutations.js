// @flow

import { t } from "@lingui/macro";
import logger from "../../utils/logger";
import { getUserIDFromRequest } from "../../utils/authentication";

export const Mutation = {
  // createManufacturer: async (parent, { data }, { prisma, request, cache, i18n }, info) => {
  //   const userId = getUserIDFromRequest(request, cache);
  //   const user = await prisma.query.user({ where: { id: userId } });
  //   // TODO: check permission
  //   if (!user) {
  //     const error = i18n._(t`Access is denied`);
  //     throw new Error(error);
  //   }
  //   // TODO: validate input
  //   const arg = {
  //     assistants: {
  //       connect: data.assistants.map(id => ({ id: id })),
  //     },
  //     businessName: data.businessName,
  //     address: {
  //       create: { data: data.address },
  //     },
  //     phone: data.phone,
  //   };
  //   return await prisma.mutation.createManufacturer(
  //     {
  //       data: arg,
  //     },
  //     info,
  //   );
  // },
};
