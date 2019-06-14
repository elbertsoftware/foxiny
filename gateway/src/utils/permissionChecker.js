//@flow

import _ from "lodash";
import { getUserIDFromRequest } from "./authentication";
import logger from "./logger";
import { validateIsEmpty } from "./validation";

const checkUserSellerOwnership = async (prisma, cache, request, sellerId) => {
  const userId = await getUserIDFromRequest(request, cache);

  const user = await prisma.query.user({
    where: {
      id: userId,
    },
  });

  if (!user) {
    logger.debug(`🛑❌  CHECK_SELLER_PERMISSION: User ${userId} not found`);
    throw new Error(`Access is denied`);
  }

  const newSellerId = validateIsEmpty(sellerId);
  const seller = await prisma.query.retailer(
    {
      where: {
        id: newSellerId,
      },
    },
    "{ id owner { user { id } } }",
  );

  if (!seller) {
    logger.debug(
      `🛑❌  CHECK_SELLER_PERMISSION: Seller ${newSellerId} not found`,
    );
    throw new Error(`Access is denied`);
  }

  const allSellerIds = seller.owner.map(usr => usr.id);
  if (allSellerIds.includes(userId)) {
    logger.debug(`🛑❌  CHECK_SELLER_PERMISSION: Access  is denied`);
    throw new Error(`Access is denied`);
  }

  logger.debug(
    `🔵✅  CHECK_SELLER_PERMISSION: Access is allowed. USER ${userId} | SELLER ${newSellerId}`,
  );
  return true;
};

const checkStaffPermission = async (
  prisma,
  cache,
  request,
  i18n,
  requiredPermissions = null,
  exception = null,
) => {
  const userId = await getUserIDFromRequest(request, cache, i18n);

  const user = await prisma.query.user(
    {
      where: {
        id: userId,
      },
    },
    "{ id assignment { id roles { id type permissions { id type } } permissions { id type } } }",
  );

  if (!user) {
    throw new Error(`Access is denied`);
  }

  const allRoles = user.assignment.roles.map(role => role.type);
  const allRights = user.assignment.roles.permissions.map(right => right.type);
  const flattenedRights = [].concat(...allRights);

  // exceptions
  if (
    user.id === exception.userId ||
    _.intersection(allRoles, exception.roles).length > 0 ||
    _.intersection(flattenedRights, exception.permissions).length > 0
  ) {
    return true;
  }

  if (_.intersection(flattenedRights, requiredPermissions).length > 0) {
    return true;
  }

  return false;
};

export { checkUserSellerOwnership, checkStaffPermission };
