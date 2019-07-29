// @flow

jest.useRealTimers();

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

/**
 * Declarations
 */

// fake client
const graphQLClient = getGraphQLClient();
// fake ip
const ngrok = require("ngrok");
// fake request
const request = new Request("test", {
  method: "POST",
  headers: { "X-Forwarded-Proto": "127.0.0.1" },
});
request.connection = { remoteAddress: "::1" };

// NOTE: to import json/js files, set moduleDirectories and moduleFileExtensions in jest configs in package.json
// NOTE: to get the test coverage: set collectCoverage in jest configs in package.json

/**
 * Unit tests on local
 */

describe("Tests through a tunnel", () => {
  let url; // ngrok tunnel url (connected)
  let xClient; // apollo boost client with ngrok url
  // Open a tunnel before runing all tests
  // and make sure that ngrok return the url that we're going to pass into the apollo booost

  beforeAll(async () => {
    url = await ngrok.connect({
      proto: "http",
      addr: "127.0.0.1:5000", //local with testing port
    });
    console.log("TEST ngrok tunnel is up");
    console.log("TEST tunnel-URL is: " + url);
    xClient = getGraphQLClientWithTunnel(null, url);
  }, 10000);

  // Close tunnel after running all tests (this is important)
  afterAll(async () => {
    await ngrok.disconnect(); // stops all tunnels
    await ngrok.kill(); // and kill its process
    console.log("TEST ngrok tunnel is down");
  });

  beforeEach(seedTestData);

  test(`Should one userId has two tokens with different ip in cache`, async () => {
    // log in by email on local ip
    let variables = {
      data: {
        email: "john@example.com",
        password: "!abcd1234",
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // log in by phone through ngrok tunnel
    variables = {
      data: {
        phone: "+840386824579",
        password: "!abcd1234",
      },
    };
    const res2 = await xClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res2.data.login.token.length).toBeGreaterThan(32);

    // get all hashes in cache
    const cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(Object.keys(cacheData).length).toBeGreaterThanOrEqual(2);
  });

  test(`Should clean all tokens of an userId in cache`, async () => {
    // local ip
    let variables = {
      data: {
        email: seedUserOne.user.email,
        password: seedUserOne.password,
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // with ngrok tunnel
    variables = {
      data: {
        phone: seedUserOne.user.phone,
        password: seedUserOne.password,
      },
    };
    const res2 = await xClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res2.data.login.token.length).toBeGreaterThan(32);

    // delete all tokens before they are expired
    auth.deleteAllTokensInCache(cache, seedUserOne.user.id);

    const cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(cacheData).toBeNull();
  });

  test("Should logout all", async () => {
    // log in by email on local ip
    let variables = {
      data: {
        email: seedUserOne.user.email,
        password: seedUserOne.password,
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // log in by phone through ngrok tunnel
    variables = {
      data: {
        phone: seedUserOne.user.phone,
        password: seedUserOne.password,
      },
    };
    const res2 = await xClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res2.data.login.token.length).toBeGreaterThan(32);

    // get all hashes in cache
    let cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(Object.keys(cacheData).length).toBeGreaterThanOrEqual(2);

    // logout all
    const graphQLClientWithToken = getGraphQLClient(res1.data.login.token);
    variables = { all: true };
    const { data } = await graphQLClientWithToken.mutate({
      mutation: operations.logout,
      variables,
    });

    cacheData = await cache.hgetall(seedUserOne.user.id);
    expect(cacheData).toBeNull();
  });
});
