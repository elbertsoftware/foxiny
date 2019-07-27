//@flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import "cross-fetch/polyfill";
import { setupI18n } from "@lingui/core";
import prisma from "../../../src/utils/prisma";
import cache from "../../../src/utils/cache";
import logger from "../../../src/utils/logger";
import i18n from "../../../src/utils/i18nHelper";
import loadPolicy from "../../../src/utils/policy";
import { Gatekeeper } from "../../../src/utils/permissionChecker";

import seedTestData, {
  seedUser0,
  seedUser1,
  seedUser2,
} from "./testData/permissionChecker.seedTestData";

const data = require("./testData/permissionsChecker.data.json");

let gatekeeper;

const initGatekeeper = data => {
  gatekeeper = new Gatekeeper(data);
};

const takeSeedUser = seed => {
  switch (seed) {
    case "seedUser0":
      return seedUser0;
      break;

    case "seedUser1":
      return seedUser1;
      break;

    case "seedUser2":
      return seedUser2;
      break;

    default:
      return null;
      break;
  }
};
const takeSellerId = seedSellerId => {
  switch (seedSellerId) {
    case "seedUser0":
    case "seedUser1":
      return seedUser2.user.id;
      break;

    case "seedUser2":
      return seedUser2.user.assignment.retailers[0].id;
      break;

    default:
      return null;
      break;
  }
};

describe("Test init gatekeeper", () => {
  describe("data loaded from prisma", () => {
    beforeAll(async done => {
      const data = await loadPolicy();
      initGatekeeper(data);
      done();
    });

    test("should init gatekeeper", () => {
      expect(gatekeeper).not.toBeUndefined();
      expect(gatekeeper.getAllPolicies()).not.toBeUndefined();
    });
  });

  describe("data loaded from file", () => {
    beforeAll(async done => {
      initGatekeeper(data.policies);
      done();
    });

    describe("initialized", () => {
      test("should init gatekeeper", () => {
        expect(gatekeeper).not.toBeUndefined();
        expect(gatekeeper.getAllPolicies()).not.toBeUndefined();
      });
    });
  });
});

describe("Test checking permissions", () => {
  beforeAll(async done => {
    const data = await loadPolicy();
    initGatekeeper(data);
    done();
  });

  beforeEach(async done => {
    await seedTestData();
    done();
  });

  afterEach(async done => {
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyRetailers();
    done();
  });

  data.tests.forEach(group => {
    switch (group.name) {
      case "registerRetailer":
        describe("Register Retailer", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`${group.data[i].description}`, async () => {
                const seedUser = takeSeedUser(group.data[i].seed);

                const result = await gatekeeper.checkPermissions(
                  seedUser.user.id,
                  "REGISTER_RETAILER",
                  i18n,
                );
                expect(result.id).not.toBeUndefined();
              });
            } else {
              test(`${group.data[i].description}`, () => {
                const seedUser = takeSeedUser(group.data[i].seed);

                expect(
                  gatekeeper.checkPermissions(
                    seedUser.user.id,
                    "REGISTER_RETAILER",
                    i18n,
                  ),
                ).rejects.toThrow();
              });
            }
          }
        });
        break;

      case "updateRetailer":
        describe("Update Retailer", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`${group.data[i].description}`, async () => {
                const seedUser = takeSeedUser(group.data[i].seed);
                const sellerId = takeSellerId(group.data[i].sellerId);

                const result = await gatekeeper.checkPermissions(
                  seedUser.user.id,
                  "UPDATE_RETAILER",
                  i18n,
                  sellerId,
                );
                expect(result.id).not.toBeUndefined();
              });
            } else {
              test(`${group.data[i].description}`, () => {
                const seedUser = takeSeedUser(group.data[i].seed);
                const sellerId = takeSellerId(group.data[i].sellerId);

                expect(
                  gatekeeper.checkPermissions(
                    seedUser.user.id,
                    "UPDATE_RETAILER",
                    i18n,
                    sellerId,
                  ),
                ).rejects.toThrow();
              });
            }
          }
        });
        break;

      case "createProduct":
        describe("Create Retail Product", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`${group.data[i].description}`, async () => {
                const seedUser = takeSeedUser(group.data[i].seed);
                const sellerId = takeSellerId(group.data[i].sellerId);

                const result = await gatekeeper.checkPermissions(
                  seedUser.user.id,
                  "CREATE_RETAIL_PRODUCT",
                  i18n,
                  sellerId,
                );
                expect(result.id).not.toBeUndefined();
              });
            } else {
              test(`${group.data[i].description}`, () => {
                const seedUser = takeSeedUser(group.data[i].seed);
                const sellerId = takeSellerId(group.data[i].sellerId);

                expect(
                  gatekeeper.checkPermissions(
                    seedUser.user.id,
                    "CREATE_RETAIL_PRODUCT",
                    i18n,
                    sellerId,
                  ),
                ).rejects.toThrow();
              });
            }
          }
        });
        break;
    }
  });
});
