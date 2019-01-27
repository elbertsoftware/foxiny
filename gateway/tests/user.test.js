// @flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/utils/prisma';
import getGraphQLClient from './utils/get-graphql-client';
import seedTestData, { seedUserOne, seedUserFour, seedUserFive } from './utils/seed-test-data';
import operations from './utils/operations';
import logger from '../src/utils/logger';
import cache from '../src/utils/cache';
import * as auth from '../src/utils/authentication';

const graphQLClient = getGraphQLClient();

const testUserOne = {
  name: 'elbertsoftware',
  email: 'elbertsoftware.tester@gmail.com',
  password: '!dcba4321',
  questionA: 'a?',
  answerA: 'a',
  questionB: 'b?',
  answerB: 'b',
};
const testUserTwo = {
  name: 'elbertsoftware',
  phone: '0386824579',
  password: '!dcba4321',
  questionA: 'a?',
  answerA: 'a',
  questionB: 'b?',
  answerB: 'b',
};
const testUserThree = {
  name: 'Jack',
  email: 'jack@example.com',
  password: '!dcba4321',
};

beforeEach(seedTestData);

/**
 *
 *  --- SIGN UP ---
 *
 */

describe(`User Tests: create a user`, () => {
  test.each`
    description                           | name                | email                                | phone           | password       | questionA    | answerA      | questionB    | answerB
    ${'email but name is undefined'}      | ${undefined}        | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is undefined'}     | ${'elbertsoftware'} | ${undefined}                         | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is undefined'}  | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${undefined}   | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is undefined'}    | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${undefined} | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is undefined'}      | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${undefined} | ${'B?'}      | ${'b'}
    ${'email but questABis undefined'}    | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${undefined} | ${'b'}
    ${'email but ansA is undefined'}      | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${undefined}
    ${'email but name is null'}           | ${null}             | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is null'}          | ${'elbertsoftware'} | ${null}                              | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is null'}       | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${null}        | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is null'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${null}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is null'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${null}      | ${'B?'}      | ${'b'}
    ${'email but questABis null'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${null}      | ${'b'}
    ${'email but ansA is null'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${null}
    ${'email but name is empty'}          | ${''}               | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is empty'}         | ${'elbertsoftware'} | ${''}                                | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is empty'}      | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${''}          | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is empty'}        | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${''}        | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is empty'}          | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${''}        | ${'B?'}      | ${'b'}
    ${'email but questABis empty'}        | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${''}        | ${'b'}
    ${'email but ansA is empty'}          | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${''}
    ${'phone but name is undefined'}      | ${undefined}        | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is undefined'}  | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${undefined}   | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is undefined'} | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${undefined} | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is undefined'}   | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${undefined} | ${'B?'}      | ${'b'}
    ${'phone but questionB is undefined'} | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${undefined} | ${'b'}
    ${'phone but answerB is undefined'}   | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${undefined}
    ${'phone but name is empty'}          | ${''}               | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is empty'}      | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${''}          | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is empty'}     | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${''}        | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is empty'}       | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${''}        | ${'B?'}      | ${'b'}
    ${'phone but questionB is empty'}     | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${''}        | ${'b'}
    ${'phone but answerB is empty'}       | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${''}
    ${'phone but name is null'}           | ${null}             | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is null'}       | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${null}        | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is null'}      | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${null}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is null'}        | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${null}      | ${'B?'}      | ${'b'}
    ${'phone but questionB is null'}      | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${null}      | ${'b'}
    ${'phone but answerB is null'}        | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${null}
    ${'null of all'}                      | ${undefined}        | ${undefined}                         | ${undefined}    | ${undefined}   | ${undefined} | ${undefined} | ${undefined} | ${undefined}
  `(
    `Should not create user by: $description`,
    async ({ name, email, phone, password, questionA, answerA, questionB, answerB }) => {
      const variables = {
        data: {
          name: name,
          email: email,
          phone: phone,
          password: password,
          questionA: questionA,
          answerA: answerA,
          questionB: questionB,
          answerB: answerB,
        },
      };
      await expect(graphQLClient.mutate({ mutation: operations.createUser, variables })).rejects.toThrow();
    },
  );

  test.each`
    description                                | name                | email                                                                             | phone            | password       | questionA | answerA | questionB | answerB
    ${'wrong email: lack of domain'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail'}                                                  | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: lack of domain'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@'}                                                       | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: lack of @ domain'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester'}                                                        | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: lack of @ domain'}         | ${'elbertsoftware'} | ${'elbertsoftware'}                                                               | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: lack of mailbox'}          | ${'elbertsoftware'} | ${'@gmail.com.io'}                                                                | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: lack of mailbox'}          | ${'elbertsoftware'} | ${'@gmail.com'}                                                                   | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: lack of mailbox & domain'} | ${'elbertsoftware'} | ${'@gmail'}                                                                       | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: double @'}                 | ${'elbertsoftware'} | ${'elbertsoftware@tester@gmail.com'}                                              | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: double @'}                 | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail@com'}                                              | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: special characters'}       | ${'elbertsoftware'} | ${'~!#$%@gmail.com'}                                                              | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: special character'}        | ${'elbertsoftware'} | ${'elbertsoftware&tester@gmail.com'}                                              | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: space'}                    | ${'elbertsoftware'} | ${'elbertsoftware tester@gmail.com'}                                              | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong email: over 64 characters'}       | ${'elbertsoftware'} | ${'1234567890123456789012345678901234567890123456789012345678901234+x@gmail.com'} | ${undefined}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong phone: has dash'}                 | ${'elbertsoftware'} | ${undefined}                                                                      | ${'-0386824579'} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong phone: has splash'}               | ${'elbertsoftware'} | ${undefined}                                                                      | ${'/0386824579'} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong phone: has letter'}               | ${'elbertsoftware'} | ${undefined}                                                                      | ${'a0386824579'} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong phone: has letter'}               | ${'elbertsoftware'} | ${undefined}                                                                      | ${'38682457a9'}  | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong phone: has singlequote'}          | ${'elbertsoftware'} | ${undefined}                                                                      | ${"'0386824579"} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong phone: has singlequote'}          | ${'elbertsoftware'} | ${undefined}                                                                      | ${"38682457'9"}  | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: only numbers'}               | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'12345678'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: lack of letter'}             | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'1234567!'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: lack of special letter'}     | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'1234567a'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: only letters'}               | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'abcdefgh'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: lack of number'}             | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'abcdefg!'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: lack of special character'}  | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'abcdefg1'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwd: only special characters'}    | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'~!@#$%^&'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'wrong pwdL < 6 character'}              | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}     | ${'ab12!'}     | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
  `(
    `Should not create user because of: $description`,
    async ({ name, email, phone, password, questionA, answerA, questionB, answerB }) => {
      const variables = {
        data: {
          name: name,
          email: email,
          phone: phone,
          password: password,
          questionA: questionA,
          answerA: answerA,
          questionB: questionB,
          answerB: answerB,
        },
      };
      await expect(graphQLClient.mutate({ mutation: operations.createUser, variables })).rejects.toThrow();
    },
  );

  test.each`
    description | name                | email                                    | phone                 | password       | questionA | answerA | questionB | answerB
    ${'email'}  | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}     | ${undefined}          | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'email'}  | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com.com'} | ${undefined}          | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'email'}  | ${'elbertsoftware'} | ${'elbertsoftware-tester@gmail.com'}     | ${undefined}          | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'+840386824579'}    | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'+84386824579'}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'+84 038 682 4579'} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'+84-038-682-4579'} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'+84.038.682.4579'} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'0386824579'}       | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'038 682 4579'}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'038-682-4579'}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'phone'}  | ${'elbertsoftware'} | ${undefined}                             | ${'038.682.4579'}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
  `(
    `Should create user by: $desciption`,
    async ({ name, email, phone, password, questionA, answerA, questionB, answerB }) => {
      const variables = {
        data: {
          name: name,
          email: email,
          phone: phone,
          password: password,
          questionA: questionA,
          answerA: answerA,
          questionB: questionB,
          answerB: answerB,
        },
      };
      const { data } = await graphQLClient.mutate({
        mutation: operations.createUser,
        variables,
      });

      const exists = await prisma.exists.User({ id: data.createUser.id });
      expect(exists).toBe(true);
    },
  );
});

// /**
//  *
//  *
//  *  --- RE-CONFIRMATION
//  *
//  */

describe(`Resend confirmation code`, () => {
  test('Should resend confirmation code with disabled/inactive account', async () => {
    const variables = { userId: seedUserFour.user.id };
    const { data } = await graphQLClient.mutate({ mutation: operations.resendConfirmation, variables });
    expect(data.resendConfirmation.id).toBe(seedUserFour.user.id);
    expect(data.resendConfirmation.email).toBeNull();
    expect(data.resendConfirmation.phone).toBeNull();
    expect(data.resendConfirmation.password).toBeNull();
    expect(data.resendConfirmation.enabled).toBe(false);
  });

  test.each`
    description                     | userId
    ${'user ID is null'}            | ${''}
    ${'user ID is null'}            | ${null}
    ${'user ID is undefined'}       | ${undefined}
    ${'user ID is not exsisted'}    | ${'0123456789'}
    ${'user is exised and enabled'} | ${() => seedUserOne.user.id}
  `(`Should not resend confirmation code because $description : $userId`, async ({ userId }) => {
    const variables = {
      userId: userId,
    };
    await expect(graphQLClient.mutate({ mutation: operations.resendConfirmation, variables })).rejects.toThrow();
  });
});

// /**
//  *
//  * --- LOGIN ---
//  *
//  */

describe('Login', () => {
  test.each`
    description   | email                 | phone           | password
    ${'by email'} | ${'john@example.com'} | ${undefined}    | ${'!abcd1234'}
    ${'by phone'} | ${undefined}          | ${'0123456789'} | ${'!abcd1234'}
  `(`Should log in`, async ({ email, phone, password }) => {
    const variables = {
      data: {
        email: email,
        phone: phone,
        password: password,
      },
    };
    const { data } = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(data.login.token.length).toBeGreaterThan(32);
  });

  test.each`
    description                  | email                 | phone            | password
    ${'by email but pwd null'}   | ${'john@example.com'} | ${undefined}     | ${''}
    ${'by email but pwd null'}   | ${'john@example.com'} | ${undefined}     | ${null}
    ${'by email but pwd null'}   | ${'john@example.com'} | ${undefined}     | ${undefined}
    ${'by email but email null'} | ${''}                 | ${undefined}     | ${'!abcd1234'}
    ${'by email but email null'} | ${null}               | ${undefined}     | ${'!abcd1234'}
    ${'by email but email null'} | ${undefined}          | ${undefined}     | ${'!abcd1234'}
    ${'by phone but pwd null'}   | ${undefined}          | ${''}            | ${'!abcd1234'}
    ${'by phone but pwd null'}   | ${undefined}          | ${null}          | ${'!abcd1234'}
    ${'by phone but pwd null'}   | ${undefined}          | ${undefined}     | ${'!abcd1234'}
    ${'by phone but pwd null'}   | ${undefined}          | ${'01234567890'} | ${''}
    ${'by phone but pwd null'}   | ${undefined}          | ${'01234567890'} | ${null}
    ${'by phone but pwd null'}   | ${undefined}          | ${'01234567890'} | ${undefined}
    ${'all null'}                | ${''}                 | ${''}            | ${''}
    ${'all null'}                | ${null}               | ${null}          | ${null}
    ${'all null'}                | ${undefined}          | ${undefined}     | ${undefined}
    ${'by email but wrong pwd'}  | ${'john@example.com'} | ${undefined}     | ${'abcd1234'}
    ${'by phone but wrong pwd'}  | ${undefined}          | ${'0123456789'}  | ${'abcd1234'}
  `(`Should log in`, async ({ email, phone, password }) => {
    const variables = {
      data: {
        email: email,
        phone: phone,
        password: password,
      },
    };
    await expect(
      graphQLClient.mutate({
        mutation: operations.login,
        variables,
      }),
    ).rejects.toThrow();
  });
});

/**
 *
 *  --- FETCH PROFILE ---
 *
 */

describe('Fetch profile', () => {
  test("Should fetch logged in user's profile", async () => {
    // log in first
    const variables = {
      data: {
        email: 'john@example.com',
        password: '!abcd1234',
      },
    };
    const res = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });

    // and then query profile
    const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
    const { data } = await graphQLClientWithToken.query({ query: operations.getProfile });

    expect(data.me.id).toBe(seedUserOne.user.id);
    expect(data.me.name).toBe(seedUserOne.user.name);
    expect(data.me.email).toBe(seedUserOne.user.email); // with authentication, email is showed
    expect(data.me.phone).toBe(seedUserOne.user.phone); // with authentication, email is showed
    expect(data.me.enabled).toBe(seedUserOne.user.enabled);
  });

  test("Should not fetch unlogged in user's profile (no token)", async () => {
    await expect(graphQLClient.query({ query: operations.getProfile })).rejects.toThrow();
  });

  test('Should expose public users profile, return no email or phone', async () => {
    const { data } = await graphQLClient.query({ query: operations.getUsers });
    expect(data.users.length).toBeGreaterThan(1); // fetch all users
    expect(data.users[0].email).toBeNull(); // show nothing
    expect(data.users[0].phone).toBeNull(); // snow nothing
  });
});

/**
 *
 *  --- LOG OUT ---
 *
 */

describe(`Log out`, () => {
  test('Should log out after logged in', async () => {
    // log in first
    const variables = {
      data: {
        email: 'john@example.com',
        password: '!abcd1234',
      },
    };
    const res = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res.data.login.token.length).toBeGreaterThan(32);

    // and then logout
    const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
    const { data } = await graphQLClientWithToken.mutate({ mutation: operations.logout });
    expect(data.logout.token).toBe(res.data.login.token);
    expect(await cache.hget(data.logout.userId, data.logout.token)).toBeNull();
  });

  test('Should not log out if not logged in (no token)', async () => {
    await expect(graphQLClient.mutate({ mutation: operations.logout })).rejects.toThrow();
  });

  test('Should log out all after logged in', async () => {
    // log in first
    const variables = {
      data: {
        email: 'john@example.com',
        password: '!abcd1234',
      },
    };
    const res = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res.data.login.token.length).toBeGreaterThan(32);

    // and then logout all
    const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
    const logout = gql`
      mutation {
        logout(all: true) {
          userId
          token
        }
      }
    `;
    const { data } = await graphQLClientWithToken.mutate({ mutation: logout });
    expect(data.logout.token).toBe(res.data.login.token);
    expect(await cache.hgetall(data.logout.userId)).toBeNull();
  });

  test('Should not log out all if not logged in (no token)', async () => {
    const logout = gql`
      mutation {
        logout(all: true) {
          userId
          token
        }
      }
    `;
    await expect(graphQLClient.mutate({ mutation: logout })).rejects.toThrow();
  });
});

/**
 *
 *  --- CONFIRM USER ---
 *
 */

describe(`Confirm user`, () => {
  test('Should confirm user account and remove the confirmation code from redis', async () => {
    expect(seedUserFour.user.id.length).toBeGreaterThan(8);
    expect(seedUserFour.confirmCode.length).toBeGreaterThan(4);

    const variables = {
      data: {
        userId: seedUserFour.user.id,
        code: seedUserFour.confirmCode,
      },
    };
    const { data } = await graphQLClient.mutate({ mutation: operations.confirmUser, variables });
    expect(data.confirmUser.enabled).toBe(true);
    expect(await cache.get(seedUserFour.confirmCode)).toBeNull();
  });

  test.each`
    description                | userId                        | code
    ${'lacking of inputs'}     | ${undefined}                  | ${undefined}
    ${'lacking of userId'}     | ${undefined}                  | ${() => seedUserFour.confirmCode}
    ${'lacking of code'}       | ${() => seedUserFour.user.id} | ${undefined}
    ${'using an invalid code'} | ${() => seedUserFour.user.id} | ${'a1b2c3'}
    ${'using an invalid code'} | ${() => seedUserFour.user.id} | ${() => seedUserFive.user.id}
  `(`Should not confirm user 4 account because of: $description`, async ({ userId, code }) => {
    expect(seedUserFour.user.id.length).toBeGreaterThan(8);
    expect(seedUserFour.confirmCode.length).toBeGreaterThan(4);

    const variables = {
      data: {
        userId: userId,
        code: code,
      },
    };
    await expect(graphQLClient.mutate({ mutation: operations.confirmUser, variables })).rejects.toThrow();
  });
});

/**
 *
 *  --- UPDATE USER ---
 *
 */

test('Should update user name', async () => {
  let variables = {
    data: {
      email: 'john@example.com',
      password: '!abcd1234',
    },
  };
  const res = await graphQLClient.mutate({
    mutation: operations.login,
    variables,
  });

  // and then query profile
  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
  variables = {
    data: {
      name: 'updated',
    },
  };
  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });
  expect(data.updateUser.id).toBe(seedUserOne.user.id);
  expect(data.updateUser.name).toBe('updated');
  expect(data.updateUser.email).toBe(seedUserOne.user.email);
});

test('Should update user email and change status to disabled', async () => {
  let variables = {
    data: {
      email: 'john@example.com',
      password: '!abcd1234',
    },
  };
  const res = await graphQLClient.mutate({
    mutation: operations.login,
    variables,
  });

  // and then query profile
  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
  variables = {
    data: {
      email: 'updated@email.com',
    },
  };
  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });
  expect(data.updateUser.id).toBe(seedUserOne.user.id);
  expect(data.updateUser.email).not.toBe(seedUserOne.user.email);
  expect(data.updateUser.enabled).toBe(false);
});

test("Should update user's phone and change status to disabled", async () => {
  let variables = {
    data: {
      email: 'john@example.com',
      password: '!abcd1234',
    },
  };
  const res = await graphQLClient.mutate({
    mutation: operations.login,
    variables,
  });

  // and then query profile
  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
  variables = {
    data: {
      phone: '9876543210',
    },
  };
  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });
  expect(data.updateUser.id).toBe(seedUserOne.user.id);
  expect(data.updateUser.phone).not.toBe(seedUserOne.user.email);
  expect(data.updateUser.enabled).toBe(false);
});

test('Should not update field if input is empty', async () => {
  let variables = {
    data: {
      email: 'john@example.com',
      password: '!abcd1234',
    },
  };
  const res = await graphQLClient.mutate({
    mutation: operations.login,
    variables,
  });

  // and then query profile
  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
  variables = {
    data: {
      name: '',
      email: null,
      phone: undefined,
    },
  };
  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });
  expect(data.updateUser.id).toBe(seedUserOne.user.id);
  expect(data.updateUser.name).toBe(seedUserOne.user.name);
  expect(data.updateUser.email).toBe(seedUserOne.user.email);
  expect(data.updateUser.phone).toBe(seedUserOne.user.phone);
});

// /**
//  *
//  *  --- DELETE USER ---
//  *
//  */

test('Should delete user', async () => {
  const variables = {
    data: {
      email: 'john@example.com',
      password: '!abcd1234',
    },
  };
  const res = await graphQLClient.mutate({
    mutation: operations.login,
    variables,
  });
  expect(res.data.login.token.length).toBeGreaterThan(32);

  const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
  const { data } = await graphQLClientWithToken.mutate({ mutation: operations.deleteUser });
  expect(data.deleteUser.id).toBe(seedUserOne.user.id);
});

// /**
//  *
//  *  --- RESET PWD ---
//  *
//  */

// // test('Should return token when make a resetPWD request', () => {});
