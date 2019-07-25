// @flow

import prisma from "../../../../src/utils/prisma";
import cache from "../../../../src/utils/cache";
import logger from "../../../../src/utils/logger";

const seedUser0 = {
  data: {
    name: "Huy Tap 0",
    email: "tap0@foxiny.com",
    phone: "123456789",
    password: "$2a$12$Ec6xzrd6D4oqx3dVBoEvj.cVcUkDs.T5yI0jjPgUiIhLCY5eMRElq",
    enabled: true,
    recoverable: false,
    assignment: {
      create: {},
    },
  },
};

const seedUser1 = {
  data: {
    name: "Huy Tap 1",
    email: "tap1@foxiny.com",
    phone: "2334567891",
    password: "$2a$12$Ec6xzrd6D4oqx3dVBoEvj.cVcUkDs.T5yI0jjPgUiIhLCY5eMRElq",
    enabled: true,
    recoverable: false,
    assignment: {
      create: {
        roles: {
          connect: [
            {
              name: "USER",
            },
            {
              name: "MEDIA",
            },
          ],
        },
      },
    },
  },
};

const seedUser2 = {
  data: {
    name: "Huy Tap 2",
    email: "tap2@foxiny.com",
    phone: "345678912",
    password: "$2a$12$Ec6xzrd6D4oqx3dVBoEvj.cVcUkDs.T5yI0jjPgUiIhLCY5eMRElq",
    enabled: true,
    recoverable: false,
    assignment: {
      create: {
        retailers: {
          create: {
            businessName: "Tap 2",
            businessPhone: "345678912",
            businessLink: "tap2",
            socialNumber: "345678912",
            businessLicense: "345678912",
            enabled: true,
          },
        },
        roles: {
          connect: [
            {
              name: "USER",
            },
            {
              name: "MEDIA",
            },
            {
              name: "RETAILER_OWNER",
            },
            {
              name: "PRODUCT_OWNER",
            },
          ],
        },
      },
    },
  },
};

const seedTestData = async () => {
  // Delete test data & clean cache
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyRetailers();
  // clean cache
  await cache.flushall();

  seedUser0.user = await prisma.mutation.createUser(
    {
      data: seedUser0.data,
    },
    "{ id assignment {id retailers { id } roles { id type permissions { id type } } permissions { id type } } }",
  );
  seedUser1.user = await prisma.mutation.createUser(
    {
      data: seedUser1.data,
    },
    "{ id assignment {id retailers { id } roles { id type permissions { id type } } permissions { id type } } }",
  );
  seedUser2.user = await prisma.mutation.createUser(
    {
      data: seedUser2.data,
    },
    "{ id assignment {id retailers { id } roles { id type permissions { id type } } permissions { id type } } }",
  );
};

export default seedTestData;
export { seedUser0, seedUser1, seedUser2 };
