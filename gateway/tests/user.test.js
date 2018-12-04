// @flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import getGraphQLClient from './utils/get-graphql-client';
import seedTestData, { seedUserOne } from './utils/seed-test-data';
import operations from './utils/operations';

const graphQLClient = getGraphQLClient();

const testUserOne = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'dcba4321',
};

beforeEach(seedTestData);

test('Should create a new user', async () => {
  const variables = {
    data: {
      ...testUserOne,
    },
  };

  const { data } = await graphQLClient.mutate({
    mutation: operations.createUser,
    variables,
  });

  const exists = await prisma.exists.User({ id: data.createUser.user.id });
  expect(exists).toBe(true);
});

test('Should not signup user with invalid password pattern', async () => {
  const variables = {
    data: {
      ...testUserOne,
      password: 'short', // short password
    },
  };

  await expect(graphQLClient.mutate({ mutation: operations.createUser, variables })).rejects.toThrow();
});

test('Should expose public author profile', async () => {
  const { data } = await graphQLClient.query({ query: operations.getUsers });

  expect(data.users.length).toBe(1);
  expect(data.users[0].name).toBe(seedUserOne.user.name);
  expect(data.users[0].email).toBe(null); // without authentication, email is hidden
});

test('Should fetch user profile', async () => {
  const graphQLClientWithToken = getGraphQLClient(seedUserOne.token);
  const { data } = await graphQLClientWithToken.query({ query: operations.getProfile });

  expect(data.me.id).toBe(seedUserOne.user.id);
  expect(data.me.name).toBe(seedUserOne.user.name);
  expect(data.me.email).toBe(seedUserOne.user.email); // with authentication, email is showed
});

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      // login with different user email and password
      email: testUserOne.email,
      password: testUserOne.password,
    },
  };

  await expect(graphQLClient.mutate({ mutation: operations.login, variables })).rejects.toThrow();
});
