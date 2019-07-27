// @flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import "cross-fetch/polyfill";

import prisma from "../../../src/utils/prisma";
import cache from "../../../src/utils/cache";
import logger from "../../../src/utils/logger";
import * as auth from "../../../src/utils/authentication";
import getGraphQLClient, {
  getGraphQLClientWithTunnel,
} from "../../utils/get-graphql-client";

import operations from "./testData/operations";

import seedTestData, {
  seedUserOne,
  seedUserTwo,
  seedUserThree,
} from "./testData/seed-test-data";

const queryTestData = require("./testData/query.json");

// fake client
const graphQLClient = getGraphQLClient();

describe("Tests on local-ip", () => {
  describe("Query", () => {
    // seeds database
    beforeEach(seedTestData);

    queryTestData.forEach(group => {
      switch (group.name) {
        case "users":
          describe("Fetch all users profiles", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (!group.data[i].loggedIn) {
                test("should expose public users profile, return no email or phone", async () => {
                  const { data } = await graphQLClient.query({
                    query: operations.getUsers,
                  });
                  expect(data.users.length).toBeGreaterThanOrEqual(3); // fetch all users
                  expect(data.users[0].name).toBeTruthy(); // show name of first user
                  expect(data.users[0].email).toBeNull(); // show nothing
                  expect(data.users[0].phone).toBeNull(); // snow nothing
                });
              }

              if (group.data[i].loggedIn) {
                test("should expose public users profile, return email or phone of logged-in user", async () => {
                  const variables = {
                    data: {
                      email: seedUserOne.user.email,
                      password: seedUserOne.password,
                    },
                  };

                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(
                    res.data.login.token,
                  );
                  const { data } = await graphQLClientWithToken.query({
                    query: operations.getUsers,
                  });
                  expect(data.users.length).toBeGreaterThanOrEqual(3); // fetch all users
                  const loggedInUser = data.users.find(
                    user => user.email === seedUserOne.user.email,
                  );
                  expect(loggedInUser.userId).toBe(seedUserOne.user.userId); // show name of first user
                  expect(loggedInUser.email).toBe(seedUserOne.user.email); // shown
                });
              }
            }
          });
          break;

        case "me":
          describe(`Fetch user profile`, () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test(`should fetch logged-in user's profile`, async () => {
                  const variables = {
                    data: {
                      email: seedUserOne.user.email,
                      password: seedUserOne.password,
                    },
                  };

                  const res = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(
                    res.data.login.token,
                  );
                  const { data } = await graphQLClientWithToken.query({
                    query: operations.getProfile,
                  });

                  expect(data).not.toBeNull();
                  expect(data.me.email).toBe(seedUserOne.user.email);
                });
              } else {
                test("should not fetch user profile", async () => {
                  await expect(
                    graphQLClient.query({ query: operations.getProfile }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "securityQuestions":
          describe(`Fetch security questions`, () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should fetch security questions", async () => {
                  const { data } = await graphQLClient.query({
                    query: operations.getSecurityQuestions,
                  });
                  expect(data).not.toBeNull();
                  expect(data.securityQuestions.length).toBeGreaterThanOrEqual(
                    3,
                  );
                });
              }
            }
          });
          break;

        default:
          break;
      }
    });
  });
});
