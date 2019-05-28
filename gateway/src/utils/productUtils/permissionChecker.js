//@flow

import { getUserIDFromRequest } from "../authentication";
import logger from "../logger";
import { validateIsEmpty } from "../validation";

const checkPermission = async (prisma, cache, request, sellerId) => {
  const userId = await getUserIDFromRequest(request, cache);

  const user = await prisma.query.user({
    where: {
      id: userId,
    },
  });

  if (!user) {
    logger.debug(`🛑❌  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: User ${userId} not found`);
    throw new Error("Access is denied");
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
    logger.debug(`🛑❌  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: Seller ${newSellerId} not found`);
    throw new Error("Access is denied");
  }

  if (seller.owner.user.id !== user.id) {
    logger.debug(`🛑❌  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: Access is denied`);
    throw new Error("Access is denied");
  }

  logger.debug(
    `🔵✅  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: Access is allowed. USER ${userId} | SELLER ${newSellerId}`,
  );
  return true;
};

export { checkPermission };
