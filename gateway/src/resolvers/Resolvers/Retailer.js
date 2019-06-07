import { getUserIDFromRequest } from "../../utils/authentication";
import logger from "../../utils/logger";

// TODO: hide owner field away from users

// How to lock down sensitive fields on non-authenticated users
const resolveField = async (parent, request, cache, i18n, value) => {
  const userId = await getUserIDFromRequest(request, cache, i18n, false); // no need to check for authentication
  logger.debug(`🔷  userId ${userId}, parent.id ${parent.id}`);
  if (userId && userId === parent.id) {
    // login user is the same as selecting user (parent)
    return value;
  }

  return null;
};

// fragment is needed to be sure User.id included no matter what the clients ask for it in the selection
export const User = {};
