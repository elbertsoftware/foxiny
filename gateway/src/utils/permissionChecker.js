// @flow

import _ from "lodash";
import prisma from "./prisma";
import cache from "./cache";
import { getUserIDFromRequest } from "./authentication";
import logger from "./logger";
import loadPolicy from "./policy";

const dataParser = data => {
  return data
    ? data.map(resolver => ({
        resolver: resolver.resolver,
        requiredPermissions: resolver.requiredPermissions.map(p => p.type),
      }))
    : { resolver: [], requiredPermissions: [] };
};

class Gatekeeper {
  #data;

  constructor(data) {
    this.#data = dataParser(data);
    logger.debug("🆙 GATEKEEPER INITIALIZED");
  }

  init = data => {
    this.#data = data;
    logger.debug("🆙 GATEKEEPER INITIALIZED");
  };

  getAllPolicies = () => {
    return this.#data;
  };

  getRolesByResolver = resolver => {
    return this.#data.find(x => x.resolver === resolver).requiredRoles;
  };

  getPermissionsByResolver = resolver => {
    return this.#data.find(x => x.resolver === resolver).requiredPermissions;
  };

  async checkPermissions(requestOrUserId, resolver, i18n, sellerId = null) {
    let userId;

    if (typeof requestOrUserId === "object") {
      userId = await getUserIDFromRequest(requestOrUserId, cache, i18n);
    } else {
      userId = requestOrUserId;
    }

    const user = await prisma.query.user(
      {
        where: { id: userId },
      },
      "{ id email phone password enabled recoverable securityAnswers { id answer securityQuestion { id question } } assignment { id retailers { id } manufacturers { id } roles { id type permissions { id type }} permissions { id type } } }",
    );
    const r = this.#data.find(x => x.resolver === resolver);

    if (!user || !r) {
      logger.error(`🔴❌  User not found or Resolver not found`);
      const error = i18n._("Access is denied");
      throw new Error(error);
    }

    // NOTE: reconstruct data
    const allRoles =
      user.assignment.roles && user.assignment.roles.length > 0
        ? user.assignment.roles.map(role => role.type)
        : [];

    let allRights =
      user.assignment.permissions && user.assignment.permissions.length > 0
        ? user.assignment.permissions.map(permission => permission.type)
        : [];

    if (user.assignment.roles) {
      user.assignment.roles.forEach(role => {
        allRights = [
          ...allRights,
          ...role.permissions.map(right => right.type),
        ];
      });
    }

    const allRetailers =
      user.assignment.retailers && user.assignment.retailers.length > 0
        ? user.assignment.retailers
            // .filter(retailer => retailer.enabled)
            .map(retailer => ({
              id: retailer.id,
              enabled: retailer.enabled,
            }))
        : [];

    const allManufacturers =
      user.assignment.manufacturers && user.assignment.manufacturers.length > 0
        ? user.assignment.manufacturers
            // .filter(manu => manu.enabled)
            .map(manu => ({
              id: manu.id,
              enabled: manu.enabled,
            }))
        : [];

    // NOTE: check conditions
    if (
      sellerId &&
      (allRetailers.includes(sellerId) || allManufacturers.includes(sellerId))
    ) {
      logger.error(`🔴❌  User hasn't got retailer or manufacturer`);
      const error = i18n._("Access is denied");
      throw new Error(error);
    }

    if (
      _.intersection(r.requiredPermissions, allRights).length !==
      r.requiredPermissions.length
    ) {
      logger.error(`🔴❌  User does not meet policies`);
      const error = i18n._("Access is denied");
      throw new Error(error);
    }

    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      password: user.password,
      securityInfo: user.securityAnswers.map(pair => ({
        questionId: pair.securityQuestion.id,
        question: pair.securityQuestion.question,
        answerId: pair.id,
        answer: pair.answer,
      })),
      roles: allRoles,
      permissions: allRights,
      retailers: allRetailers,
      manufacturers: allManufacturers,
      enabled: user.enabled,
      recoverable: user.recoverable,
    };

    return userData;
  }
}
export { Gatekeeper };

loadPolicy()
  .then(data => {
    const gatekeeper = new Gatekeeper(data);
    exports.gatekeeper = gatekeeper;
  })
  .catch(error => {
    logger.error(JSON.stringify(error, undefined, 2));
  });
