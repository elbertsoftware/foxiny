//@flow

import "cross-fetch/polyfill";
import jwt from "jsonwebtoken";

import i18n from "../../../src/utils/i18nHelper";
import cache from "../../../src/utils/cache";
import * as auth from "../../../src/utils/authentication";

const authenticationTestData = require("./testData/authentication.json");

// fake request
const request = new Request("test", {
  method: "POST",
  headers: { "X-Forwarded-Proto": "127.0.0.1" },
});
request.connection = { remoteAddress: "::1" };

describe("Authentication functions tests", () => {
  authenticationTestData.forEach(group => {
    switch (group.name) {
      case "isValidPassword":
        break;

      case "hashPassword":
        describe("Hash password", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return a hashed password string`, () => {
                expect(() =>
                  auth.hashPassword(group.data[i].password),
                ).not.toThrow();
              });
            }
          }
        });
        break;

      case "verifyPassword":
        describe("Verify Password", () => {
          for (let i = 0; i < group.data.length; i++) {
            const hasedPassword_1 = auth.hashPassword("@abc1234");
            const hasedPassword_2 = auth.hashPassword("@abc123");
            if (group.data[i].expected) {
              test(`should return true`, () => {
                expect(
                  auth.verifyPassword(group.data[i].password, hasedPassword_1),
                ).toBeTruthy();
              });
            } else {
              test(`should return false since wrong pwd`, () => {
                expect(
                  auth.verifyPassword(group.data[i].password, hasedPassword_2),
                ).toBeFalsy();
              });
            }
          }
        });
        break;

      case "generateConfirmation":
        describe("Generate Confirmation", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test(`should return confirmation code`, () => {
                expect(
                  auth.generateConfirmation(
                    cache,
                    group.data[i].userId,
                    group.data[i].emailOrPhone,
                  ),
                ).not.toBeNull();
              });
            }
          }
        });
        break;

      case "verifyConfirmation":
        break;

      case "generateToken":
        describe("Generate token, save it to cache", () => {
          for (let i = 0; i < group.data.length; i++) {
            test("should return token", async () => {
              const token = auth.generateToken(
                group.data[i].userId,
                request,
                cache,
              );
              expect(token.length).toBeGreaterThanOrEqual(32);
            });
          }
        });

      case "getTokenFromRequest":
        describe("Get token from request (authed)", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should return token", async () => {
                const token = auth.generateToken(
                  group.data[i].userId,
                  request,
                  cache,
                );

                const authedRequest = new Request("test", {
                  method: "POST",
                  headers: {},
                });
                authedRequest.headers.authorization = `Bearer ${token}`;
                authedRequest.connection = { remoteAddress: "::1" };
                authedRequest.connection.context = {
                  Authorization: `Bearer ${token}`,
                };

                expect(auth.getTokenFromRequest(authedRequest)).toBe(token);
              });
            } else {
              test("should return null", async () => {
                const token = auth.generateToken(
                  group.data[i].userId,
                  request,
                  cache,
                );

                const authedRequest = new Request("test", {
                  method: "POST",
                  headers: {},
                });
                authedRequest.connection = { remoteAddress: "::1" };

                expect(auth.getTokenFromRequest(authedRequest)).toBeNull();
              });
            }
          }
        });
        break;

      case "getUserIdFromRequest":
        describe("Get user Id from request (authed)", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should return userId", async () => {
                const token = auth.generateToken(
                  group.data[i].userId,
                  request,
                  cache,
                );

                const authedRequest = new Request("test", {
                  method: "POST",
                  headers: {},
                });
                authedRequest.headers.authorization = `Bearer ${token}`;
                authedRequest.connection = { remoteAddress: "::1" };
                authedRequest.connection.context = {
                  Authorization: `Bearer ${token}`,
                };

                if (!group.data[i].requireAuthentication) {
                  authedRequest.connection = { remoteAddress: "::2" };
                }

                if (group.data[i].requireAuthentication) {
                  const userId = await auth.getUserIDFromRequest(
                    authedRequest,
                    cache,
                    i18n,
                  );
                  expect(userId).toBe(group.data[i].validUserId);
                } else {
                  const userId = await auth.getUserIDFromRequest(
                    authedRequest,
                    cache,
                    i18n,
                    group.data[i].requireAuthentication,
                  );
                  expect(userId).toBeNull();
                }
              });
            } else {
              test("should throw error or return null", async () => {
                const token = auth.generateToken(
                  group.data[i].userId,
                  request,
                  cache,
                );

                const authedRequest = new Request("test", {
                  method: "POST",
                  headers: {},
                });
                authedRequest.headers.authorization = `Bearer ${token}`;
                authedRequest.connection = { remoteAddress: "::1" };
                authedRequest.connection.context = {
                  Authorization: `Bearer ${token}`,
                };

                if (!group.data[i].request) {
                  authedRequest.headers.authorization = undefined;
                  authedRequest.connection = { remoteAddress: "" };
                  authedRequest.connection.context = {
                    Authorization: undefined,
                  };
                }

                if (group.data[i].requireAuthentication) {
                  await expect(
                    auth.getUserIDFromRequest(
                      request,
                      cache,
                      i18n,
                      group.data[i].requireAuthentication,
                    ),
                  ).rejects.toThrow();
                } else {
                  const userId = await auth.getUserIDFromRequest(
                    authedRequest,
                    cache,
                    i18n,
                    group.data[i].requireAuthentication,
                  );
                  expect(userId).toBeNull();
                }
              });
            }
          }
        });
        break;

      case "checkTokenExpiration":
        describe("Check jwt expiration", () => {
          for (let i = 0; i < group.data.length; i++) {
            if (group.data[i].expected) {
              test("should verify token", () => {
                const expiresIn = group.data[i].expiration;
                const token = jwt.sign({ iat: Date.now() }, "abc123", {
                  expiresIn,
                });
                expect(() =>
                  jwt.verify(token, "abc123", { expiresIn }),
                ).not.toThrow();
              });
            } else {
              test("should not verify token", async () => {
                const expiresIn = group.data[i].expiration;
                const token = jwt.sign({ iat: Date.now() }, "abc123", {
                  expiresIn,
                });
                await new Promise(resolve =>
                  setTimeout(() => {
                    expect(() =>
                      jwt.verify(token, "abc123", {
                        expiresIn: expiresIn,
                        clockTimestamp: Date.now(),
                      }),
                    ).toThrow();
                    resolve();
                  }, 3000),
                );
              }, 5000);
            }
          }
        });
        break;

      default:
        break;
    }
  });
});
