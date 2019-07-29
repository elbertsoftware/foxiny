// @flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import "cross-fetch/polyfill";

import prisma from "../../../src/utils/prisma";
import cache from "../../../src/utils/cache";
import logger from "../../../src/utils/logger";
import getGraphQLClient from "../../utils/get-graphql-client";

import operations from "./testData/operations";

import seedTestData, {
  seedUserOne,
  seedUserTwo,
  seedUserThree,
} from "./testData/seed-test-data";

const mutationTestData = require("./testData/mutation.json");

// fake client
const graphQLClient = getGraphQLClient();

describe("Tests on local-ip", () => {
  describe(`Mutation tests`, () => {
    // seeds database
    beforeEach(seedTestData);

    mutationTestData.forEach(group => {
      switch (group.name) {
        case "createUser":
          describe("Create user", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should create user", async () => {
                  const variables = {
                    data: {
                      name: group.data[i].user.name
                        ? group.data[i].user.name
                        : undefined,
                      email: group.data[i].user.email
                        ? group.data[i].user.email
                        : undefined,
                      phone: group.data[i].user.phone
                        ? group.data[i].user.phone
                        : undefined,
                      password: group.data[i].user.password
                        ? group.data[i].user.password
                        : undefined,
                    },
                  };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.createUser,
                    variables,
                  });

                  const exists = await prisma.exists.User({
                    id: data.createUser.id,
                  });

                  expect(exists).toBe(true);
                });
              } else {
                test("should not create user", async () => {
                  const variables = {
                    data: {
                      name: group.data[i].user.name
                        ? group.data[i].user.name
                        : undefined,
                      email: group.data[i].user.email
                        ? group.data[i].user.email
                        : undefined,
                      phone: group.data[i].user.phone
                        ? group.data[i].user.phone
                        : undefined,
                      password: group.data[i].user.password
                        ? group.data[i].user.password
                        : undefined,
                    },
                  };

                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.createUser,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "confirmUser":
          describe("Confirm user", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should confirm user", async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId
                        ? seedUserTwo.user.id
                        : undefined,
                      email: group.data[i].data.email
                        ? seedUserTwo.user.email
                        : undefined,
                      phone: group.data[i].data.phone
                        ? seedUserTwo.user.phone
                        : undefined,
                      code: group.data[i].data.email
                        ? seedUserTwo.confirmEmailCode
                        : seedUserTwo.confirmPhoneCode,
                    },
                  };

                  const { data } = await graphQLClient.mutate({
                    mutation: operations.confirmUser,
                    variables,
                  });

                  expect(data.confirmUser).toBe(true);
                });
              } else {
                test("should not confirm user", async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId
                        ? seedUserTwo.user.id
                        : undefined,
                      email: group.data[i].data.email
                        ? seedUserTwo.user.email
                        : undefined,
                      phone: group.data[i].data.phone
                        ? seedUserTwo.user.phone
                        : undefined,
                      code: group.data[i].data.code
                        ? group.data[i].data.email
                          ? seedUserTwo.confirmEmailCode
                          : seedUserTwo.confirmPhoneCode
                        : undefined,
                    },
                  };

                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.confirmUser,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "resendConfirmation":
          describe("Resend confirmation code", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should resend confirmation code", async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId
                        ? seedUserTwo.user.id
                        : undefined,
                      email: group.data[i].data.email
                        ? seedUserTwo.user.email
                        : undefined,
                      phone: group.data[i].data.phone
                        ? seedUserTwo.user.phone
                        : undefined,
                    },
                  };

                  const { data } = await graphQLClient.mutate({
                    mutation: operations.resendConfirmation,
                    variables,
                  });

                  expect(data.resendConfirmation).toBe(true);
                });
              } else {
                test("should not resend confirmation code", async () => {
                  const variables = {
                    data: {
                      userId: group.data[i].data.userId
                        ? seedUserTwo.user.id
                        : undefined,
                      email: group.data[i].data.email
                        ? seedUserTwo.user.email
                        : undefined,
                      phone: group.data[i].data.phone
                        ? seedUserTwo.user.phone
                        : undefined,
                    },
                  };

                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.resendConfirmation,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "login":
          describe("Login", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should log in", async () => {
                  const variables = {
                    data: {
                      email: group.data[i].data.email
                        ? seedUserOne.user.email
                        : undefined,
                      phone: group.data[i].data.phone
                        ? seedUserOne.user.phone
                        : undefined,
                      password: group.data[i].data.password
                        ? seedUserOne.password
                        : undefined,
                    },
                  };

                  const { data } = await graphQLClient.mutate({
                    mutation: operations.login,
                    variables,
                  });

                  expect(data.login.token.length).toBeGreaterThan(32);
                });
              } else {
                test("should not log in", async () => {
                  const seededUser = group.data[i].data.confirmed
                    ? seedUserOne
                    : seedUserTwo;
                  const variables = {
                    data: {
                      email: group.data[i].data.email
                        ? seededUser.user.email
                        : undefined,
                      phone: group.data[i].data.phone
                        ? seededUser.user.phone
                        : undefined,
                      password: group.data[i].data.password
                        ? seededUser.password
                        : undefined,
                    },
                  };

                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.login,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "logout":
          describe("Log out", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should log out", async () => {
                  // logs in first
                  const variables = {
                    data: {
                      email: seedUserOne.data.email,
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
                  const { data } = await graphQLClientWithToken.mutate({
                    mutation: operations.logout,
                  });
                  expect(data.logout.token).toBe(res.data.login.token);
                });
              }
            }
          });
          break;

        case "upsertSecurityInfo":
          describe("Update/Insert security info", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should update security info", async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
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

                  variables = { securityInfo: group.data[i].securityInfo };

                  const { data } = await graphQLClientWithToken.mutate({
                    mutation: operations.upsertSecurityInfo,
                    variables,
                  });
                  // expect(data.upsertSecurityInfo).toBeNull();
                  expect(data.upsertSecurityInfo.recoverable).toBe(true);
                });
              } else {
                test("should update security info", async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
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

                  variables = { securityInfo: group.data[i].securityInfo };

                  await expect(
                    graphQLClientWithToken.mutate({
                      mutation: operations.upsertSecurityInfo,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "updateUser":
          describe("Update user", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should update user", async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
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

                  variables = {
                    data: {
                      name: group.data[i].data.name || undefined,
                      email: group.data[i].data.email || undefined,
                      phone: group.data[i].data.phone || undefined,
                      password: group.data[i].data.password || undefined,
                      currentPassword:
                        group.data[i].data.currentPassword || undefined,
                    },
                  };

                  const { data } = await graphQLClientWithToken.mutate({
                    mutation: operations.updateUser,
                    variables,
                  });

                  expect(data.updateUser.id).toBeTruthy();
                });
              } else {
                test("should not udpdate user", async () => {
                  // logs in first
                  let variables = {
                    data: {
                      email: seedUserOne.data.email,
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

                  variables = {
                    data: {
                      name: group.data[i].data.name || undefined,
                      email: group.data[i].data.email || undefined,
                      phone: group.data[i].data.phone || undefined,
                      password: group.data[i].data.password || undefined,
                      currentPassword:
                        group.data[i].data.currentPassword || undefined,
                    },
                  };

                  await expect(
                    graphQLClientWithToken.mutate({
                      mutation: operations.updateUser,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "requestResetPwd":
          describe("User forgot pwd and requests resetPWD", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should return security questions", async () => {
                  const variables = { mailOrPhone: group.data[i].mailOrPhone };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.requestResetPwd,
                    variables,
                  });
                  expect(data.requestResetPwd).not.toBeNull();
                  expect(data.requestResetPwd.token).not.toBeNull();
                  expect(
                    data.requestResetPwd.securityQuestions.length,
                  ).toBeGreaterThanOrEqual(3);
                });
              } else {
                test("should not return security questions", async () => {
                  const variables = { mailOrPhone: group.data[i].mailOrPhone };
                  await expect(
                    graphQLClient.mutate({
                      mutation: operations.requestResetPwd,
                      variables,
                    }),
                  ).rejects.toThrow();
                });
              }
            }
          });
          break;

        case "resetPassword":
          describe("User enter security info and new password", () => {
            for (let i = 0; i < group.data.length; i++) {
              if (group.data[i].expected) {
                test("should change pwd", async () => {
                  let variables = { mailOrPhone: seedUserThree.data.email };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.requestResetPwd,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(
                    data.requestResetPwd.token,
                  );
                  variables = {
                    data: {
                      securityInfo: data.requestResetPwd.securityQuestions.map(
                        (q, i) => ({
                          questionId: q.id,
                          answer: i.toString(),
                        }),
                      ),
                      password: group.data[i].data.password,
                    },
                  };

                  const res = await graphQLClientWithToken.mutate({
                    mutation: operations.resetPassword,
                    variables,
                  });
                  expect(res.data.resetPassword).toBe(true);
                });
              } else {
                test("should throw error", async () => {
                  let variables = { mailOrPhone: seedUserThree.data.email };
                  const { data } = await graphQLClient.mutate({
                    mutation: operations.requestResetPwd,
                    variables,
                  });

                  const graphQLClientWithToken = getGraphQLClient(
                    group.data[i].token ? data.requestResetPwd.token : null,
                  );
                  variables = {
                    data: {
                      securityInfo: group.data[i].data.securityInfo
                        ? data.requestResetPwd.securityQuestions.map(
                            (q, i) => ({
                              questionId: q.id,
                              answer: i.toString(),
                            }),
                          )
                        : undefined,
                      password: group.data[i].data.password
                        ? group.data[i].data.password
                        : undefined,
                    },
                  };

                  await expect(
                    graphQLClientWithToken.mutate({
                      mutation: operations.resetPassword,
                      variables,
                    }),
                  ).rejects.toThrow();
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
