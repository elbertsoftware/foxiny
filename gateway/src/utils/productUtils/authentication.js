// @flow
import { t } from "@lingui/macro";
import ms from "ms";
import cryptoRandomString from "crypto-random-string";

import logger from "./logger";

const generateConfirmation = (cache, sellerId, emailOrPhone) => {
  const code = cryptoRandomString(parseInt(process.env.CONFIRMATION_LENGTH, 10));
  logger.debug(`generated new confirmation code ${code} for sellerId ${sellerId}`);

  cache.set(
    code,
    JSON.stringify({ sellerId: sellerId || undefined, emailOrPhone }),
    "EX",
    ms(process.env.CONFIRMATION_EXPIRATION) / 1000,
  ); // convert to seconds
  return code;
};

const verifyConfirmation = async (cache, code, sellerId, i18n) => {
  const data = JSON.parse(await cache.get(code));

  if (!data) {
    const error = i18n._(t`Invalid confirmation code`);
    throw new Error(error);
  }

  logger.debug(
    `verifying confirmation code ${code} for sellerId ${sellerId ||
      data.emailOrPhone} upon the cached sellerId ${data.sellerId || data.emailOrPhone}`,
  );

  // delete the code after verifying
  cache.del(code);
  logger.debug(
    `the confirmation code ${code} for sellerId ${sellerId || data.emailOrPhone} has been deleted from cache`,
  );

  if (sellerId) {
    return data.sellerId === sellerId && data.emailOrPhone;
  }

  return data.emailOrPhone;
};

export { generateConfirmation, verifyConfirmation };
