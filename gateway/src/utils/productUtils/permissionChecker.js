//@flow

import { getUserIDFromRequest } from "../authentication";
import logger from "../logger";

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

  const seller = await prisma.query.retailer(
    {
      where: {
        id: sellerId,
      },
    },
    "{ id owner { user { id } } }",
  );

  if (!user) {
    logger.debug(`🛑❌  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: Seller ${sellerId} not found`);
    throw new Error("Access is denied");
  }

  console.log(JSON.stringify(user.id, undefined, 2));
  console.log(JSON.stringify(seller.owner.user.id, undefined, 2));
  if (seller.owner.user.id !== user.id) {
    logger.debug(`🛑❌  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: Access is denied`);
    throw new Error("Access is denied");
  }

  logger.debug(`🔵✅  CREATE_BRANDNEW_PRODUCT_WITH_TEMPLATE: Access is allowed. USER ${userId} | SELLER ${sellerId}`);
  return true;
};

export { checkPermission };
