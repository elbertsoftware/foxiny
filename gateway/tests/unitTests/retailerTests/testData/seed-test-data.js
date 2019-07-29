// @flow

import prisma from "../../../../src/utils/prisma";
import {
  hashPassword,
  generateToken,
  generateConfirmation,
} from "../../../../src/utils/authentication";
import cache from "../../../../src/utils/cache";
import logger from "../../../../src/utils/logger";
import { verifyPassword } from "../../../../src/utils/authentication";

const seedUser = {
  data: {
    name: "John Smith",
    email: "userRetailer@abc.com",
    password: hashPassword("@abcd1234"),
    enabled: true,
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
  password: "!abcd1234",
  user: undefined,
  token: undefined,
};

const login = async userId => {
  const request = new Request();

  request.headers.set("method", "POST");
  request.headers.set("X-Forwarded-For", "127.0.0.0");

  return generateToken(userId, request, cache);
};

const seedTestData = async () => {
  // Delete test data & clean cache
  await prisma.mutation.deleteManyUsers();
  // clean cache
  await cache.flushall();

  // Seed user
  seedUser.user = await prisma.mutation.createUser({
    data: seedUser.data,
  });
  seedUser.retailers = await prisma.query.retailers({
    where: {
      owner: {
        user: {
          id: seedUser.user.id,
        },
      },
    },
  });
  seedUser.token = await login(seedUser.user.id);
};

export default seedTestData;

export { login };
