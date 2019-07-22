// @flow

import prisma from "./prisma";
import logger from "./logger";

const loadPolicy = async () => {
  try {
    const claims = await prisma.query.policies(
      null,
      "{ id resolver requiredPermissions { id type priority } createdAt updatedAt }",
    );
    logger.debug("🆙 POLICY LOADED");
    return claims;
  } catch (error) {
    throw error;
  }
};

// export default loadPolicy();
export default loadPolicy;
