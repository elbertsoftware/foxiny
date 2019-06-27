//@flow

import _ from "lodash";
import { getUserIDFromRequest } from "./authentication";
import logger from "./logger";
import { resolversClaim } from "./prisma.js";

// const reconstructResolversClaim = claim => {
//   let allRoles =
//     claim.requiredRoles && claim.requiredRoles.length > 0
//       ? claim.requiredRoles.map(role => role.name)
//       : [];
//   let allPermissions =
//     claim.requiredPermissions && claim.requiredPermissions.length > 0
//       ? claim.requiredPermissions.map(permissions => permissions.type)
//       : [];
//   claim.requiredRoles.forEach(c => {
//     allPermissions = [...allPermissions, c.permissions.map(per => per.type)];
//   });
//   return {
//     id: claim.id,
//     resolverName: claim.resolverName,
//     requiredRoles: allRoles,
//     requiredPermissions: _.uniqBy(allPermissions),
//   };
// };

// const reconstructUserClaim = claim => {

// }

// class Gatekeeper {
//   #resolversClaim;
//   constructor(resolversClaim) {
//     this.resolversClaim = resolversClaim.map(claim =>
//       reconstructResolversClaim(claim),
//     );
//   }

//   getRequiredRolesByResolver(resolverName) {
//     return this.resolversClaim.find(
//       claim => claim.resolverName === resolverName,
//     ).requiredRoles;
//   }

//   getRequiredPermissionsByResolver(resolverName) {
//     return this.resolversClaim.find(
//       claim => claim.resolverName === resolverName,
//     ).requiredPermissions;
//   }

//   setResolversClaim(resolversClaim) {
//     this.resolversClaim = resolversClaim;
//     return true;
//   }

//   /**
//    * Gatekeeper
//    * @param {Object} prisma prisma instance
//    * @param {Object} cache cache intance
//    * @param {Object} request request object
//    * @param {Object} i18n i18n instance
//    * @param {Object} required contains required roles or permissions
//    * @param {Object} exception contains exceptional roles or permissions
//    */
//   static async checkUserPermission(prisma, cache, request, i18n, resolverName) {
//     const userId = await getUserIDFromRequest(request, cache, i18n);

//     let user = await prisma.query.user(
//       {
//         where: {
//           id: userId,
//         },
//       },
//       "{ id assignment { id retailers { id enabled } manufacturers { id  enabled } roles { id type permissions { id type } } permissions { id type } } enabled }",
//     );

//     if (!user || !user.enabled) {
//       const error = i18n.t`User not found or disabled`;
//       throw new Error(error);
//     }

//     // reconstruct list of role and permission
//     const allRoles = user.assignment.roles
//       ? user.assignment.roles.map(role => role.type)
//       : [];
//     let flattenedRights = user.assignment.permissions.map(
//       permission => permission.type,
//     );
//     user.assignment.roles.forEach(role => {
//       flattenedRights = [
//         ...flattenedRights,
//         ...role.permissions.map(right => right.type),
//       ];
//     });
//     const allRetailers = user.assignment.retailers
//       ? user.assignment.retailers
//           .filter(retailer => retailer.enabled)
//           .map(retailer => retailer.id)
//       : [];
//     const allManufacturers = user.assignment.manufacturers
//       ? user.assignment.manufacturers
//           .filter(manu => manu.enabled)
//           .map(manu => manu.id)
//       : [];
//     // reconstruct user object
//     user = {
//       id: user.id,
//       roles: allRoles,
//       permissions: flattenedRights,
//       retailers: allRetailers,
//       manufacturers: allManufacturers,
//       enabled: user.enabled,
//     };

//     // except
//     if (exception) {
//       if (
//         _.intersection(allRoles, exception.roles).length > 0 ||
//         _.intersection(flattenedRights, exception.permissions).length > 0
//       ) {
//         return user;
//       }
//     }

//     // require
//     if (
//       _.intersection(allRoles, required.roles).length > 0 ||
//       _.intersection(flattenedRights, required.permissions).length > 0
//     ) {
//       return user;
//     }

//     const error = i18n.t`Access is denied`;
//     throw new Error(error);
//   }

//   /**
//    * gatekeeper
//    * @param {Object} prisma prisma instance
//    * @param {Object} request request object
//    * @param {Object} cache cache instance
//    * @param {Object} i18n i18n instance
//    * @param {String} retailerId string of retailerId
//    * @param {Object} exception contain exceptional roles and permissions
//    */
//   static async checkUserRetailerOwnership(
//     prisma,
//     request,
//     cache,
//     i18n,
//     retailerId,
//     exception = null,
//   ) {
//     const user = await checkUserPermission(prisma, cache, request, i18n, {
//       roles: ["RETAILER", "RETAILER_ADMIN", "ROOT"],
//     });

//     if (user.retailers.includes(retailerId)) {
//       return user;
//     }

//     if (
//       _.intersection(user.roles, exception.roles).length > 0 ||
//       _.intersection(user.permissions, exception.permissions).length > 0
//     ) {
//       return user;
//     }

//     const error = i18n.t`Access is denied`;
//     throw new Error(error);
//   }

//   /**
//    * gatekeeper
//    * @param {Object} prisma prisma instance
//    * @param {Object} request request object
//    * @param {Object} cache cache instance
//    * @param {Object} i18n i18n instance
//    * @param {String} manufacturerId string of manufacturerId
//    * @param {Object} exception contain exceptional roles and permissions
//    */
//   static async checkUserManufacturerOwnership(
//     prisma,
//     request,
//     cache,
//     i18n,
//     manufacturerId,
//     exception = null,
//   ) {
//     const user = await checkUserPermission(prisma, cache, request, i18n, {
//       roles: ["RETAILER", "RETAILER_ADMIN", "ROOT"],
//     });

//     if (user.retailers.includes(retailerId)) {
//       return user;
//     }

//     if (
//       _.intersection(user.roles, exception.roles).length > 0 ||
//       _.intersection(user.permissions, exception.permissions).length > 0
//     ) {
//       return user;
//     }

//     const error = i18n.t`Access is denied`;
//     throw new Error(error);
//   }

//   static async checkUserSellerOwnership(
//     prisma,
//     request,
//     cache,
//     i18n,
//     manufacturerId,
//     exception = null,
//   ) {
//     const user = await checkUserPermission(prisma, cache, request, i18n, {
//       roles: [
//         "RETAILER",
//         "RETAILER_ADMIN",
//         "MANUFACTURER",
//         "MANUFACTURER_ADMIN",
//         "ROOT",
//       ],
//     });

//     if (user.retailers.includes(retailerId)) {
//       return { ...user, isRetailer: true, isManufacturer: false };
//     }
//     if (user.manufacturer.included(retailerId)) {
//       return { ...user, isRetailer: false, isManufacturer: true };
//     }

//     if (
//       _.intersection(user.roles, exception.roles).length > 0 ||
//       _.intersection(user.permissions, exception.permissions).length > 0
//     ) {
//       return { ...user, isException: true };
//     }

//     const error = i18n.t`Access is denied`;
//     throw new Error(error);
//   }
// }

/**
 * Gatekeeper
 * @param {Object} prisma prisma instance
 * @param {Object} cache cache intance
 * @param {Object} request request object
 * @param {Object} i18n i18n instance
 * @param {Object} required contains required roles or permissions
 * @param {Object} exception contains exceptional roles or permissions
 */
const checkUserPermission = async (
  prisma,
  cache,
  request,
  i18n,
  required = null,
  exception = null,
) => {
  const userId = await getUserIDFromRequest(request, cache, i18n);

  let user = await prisma.query.user(
    {
      where: {
        id: userId,
      },
    },
    "{ id assignment { id retailers { id enabled } manufacturers { id  enabled } roles { id type permissions { id type } } permissions { id type } } enabled }",
  );

  if (!user || !user.enabled) {
    const error = i18n.t`User not found or disabled`;
    throw new Error(error);
  }

  // reconstruct list of role and permission
  const allRoles = user.assignment.roles
    ? user.assignment.roles.map(role => role.type)
    : [];
  let flattenedRights = user.assignment.permissions.map(
    permission => permission.type,
  );
  user.assignment.roles.forEach(role => {
    flattenedRights = [
      ...flattenedRights,
      ...role.permissions.map(right => right.type),
    ];
  });
  const allRetailers = user.assignment.retailers
    ? user.assignment.retailers
        .filter(retailer => retailer.enabled)
        .map(retailer => retailer.id)
    : [];
  const allManufacturers = user.assignment.manufacturers
    ? user.assignment.manufacturers
        .filter(manu => manu.enabled)
        .map(manu => manu.id)
    : [];
  // reconstruct user object
  user = {
    id: user.id,
    roles: allRoles,
    permissions: flattenedRights,
    retailers: allRetailers,
    manufacturers: allManufacturers,
    enabled: user.enabled,
  };

  // except
  if (exception) {
    if (
      _.intersection(allRoles, exception.roles).length > 0 ||
      _.intersection(flattenedRights, exception.permissions).length > 0
    ) {
      return user;
    }
  }

  // require
  if (
    _.intersection(allRoles, required.roles).length > 0 ||
    _.intersection(flattenedRights, required.permissions).length > 0
  ) {
    return user;
  }

  const error = i18n.t`Access is denied`;
  throw new Error(error);
};

/**
 * gatekeeper
 * @param {Object} prisma prisma instance
 * @param {Object} request request object
 * @param {Object} cache cache instance
 * @param {Object} i18n i18n instance
 * @param {String} retailerId string of retailerId
 * @param {Object} exception contain exceptional roles and permissions
 */
const checkUserRetailerOwnership = async (
  prisma,
  request,
  cache,
  i18n,
  retailerId,
  exception = null,
) => {
  const user = await checkUserPermission(prisma, cache, request, i18n, {
    roles: ["RETAILER", "RETAILER_ADMIN", "ROOT"],
  });

  if (user.retailers.includes(retailerId)) {
    return user;
  }

  if (
    _.intersection(user.roles, exception.roles).length > 0 ||
    _.intersection(user.permissions, exception.permissions).length > 0
  ) {
    return user;
  }

  const error = i18n.t`Access is denied`;
  throw new Error(error);
};

/**
 * gatekeeper
 * @param {Object} prisma prisma instance
 * @param {Object} request request object
 * @param {Object} cache cache instance
 * @param {Object} i18n i18n instance
 * @param {String} manufacturerId string of manufacturerId
 * @param {Object} exception contain exceptional roles and permissions
 */
const checkUserManufacturerOwnership = async (
  prisma,
  request,
  cache,
  i18n,
  manufacturerId,
  exception = null,
) => {
  const user = await checkUserPermission(prisma, cache, request, i18n, {
    roles: ["RETAILER", "RETAILER_ADMIN", "ROOT"],
  });

  if (user.retailers.includes(retailerId)) {
    return user;
  }

  if (
    _.intersection(user.roles, exception.roles).length > 0 ||
    _.intersection(user.permissions, exception.permissions).length > 0
  ) {
    return user;
  }

  const error = i18n.t`Access is denied`;
  throw new Error(error);
};

const checkUserSellerOwnership = async (
  prisma,
  cache,
  request,
  i18n,
  sellerId,
  exception = null,
) => {
  const user = await checkUserPermission(prisma, cache, request, i18n, {
    roles: [
      "RETAILER",
      "RETAILER_ADMIN",
      "MANUFACTURER",
      "MANUFACTURER_ADMIN",
      "ROOT",
    ],
  });

  if (user.retailers.includes(sellerId)) {
    return { ...user, isRetailer: true, isManufacturer: false };
  }
  if (user.manufacturers.includes(sellerId)) {
    return { ...user, isRetailer: false, isManufacturer: true };
  }

  if (
    exception &&
    (_.intersection(user.roles, exception.roles).length > 0 ||
      _.intersection(user.permissions, exception.permissions).length > 0)
  ) {
    return { ...user, isException: true };
  }

  const error = i18n.t`Access is denied`;
  throw new Error(error);
};

export {
  checkUserPermission,
  checkUserRetailerOwnership,
  checkUserManufacturerOwnership,
  checkUserSellerOwnership,
};
