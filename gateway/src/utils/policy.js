// @flow

import prisma from "./prisma";
import logger from "./logger";

const loadPolicy = async () => {
  const claims = await prisma.query.policies(
    null,
    "{ id resolver requiredPermissions { id type priority } createdAt updatedAt }",
  );
  logger.debug("🆙 POLICY LOADED");
  return claims;
};

export default loadPolicy();
