// @flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/utils/prisma';
import getGraphQLClient, { getGraphQLClientWithTunnel } from './utils/get-graphql-client';
import seedTestData, { seedUserOne, seedUserFour, seedUserFive } from './utils/seed-test-data';
import operations from './utils/operations';
import logger from '../src/utils/logger';
import cache from '../src/utils/cache';
import * as auth from '../src/utils/authentication';

const ngrok = require('ngrok');

const graphQLClient = getGraphQLClient();

beforeEach(seedTestData);

/**
 *
 *  --- SIGN UP ---
 *
 */

describe(`User Tests: create a user`, () => {
  test.each`
    description                             | name                | email                                | phone           | password       | questionA    | answerA      | questionB    | answerB
    ${'email but name is undefined'}        | ${undefined}        | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is undefined'}       | ${'elbertsoftware'} | ${undefined}                         | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is undefined'}    | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${undefined}   | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is undefined'}      | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${undefined} | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is undefined'}        | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${undefined} | ${'B?'}      | ${'b'}
    ${'email but questABis undefined'}      | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${undefined} | ${'b'}
    ${'email but ansA is undefined'}        | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${undefined}
    ${'email but name is null'}             | ${null}             | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is null'}            | ${'elbertsoftware'} | ${null}                              | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is null'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${null}        | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is null'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${null}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is null'}             | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${null}      | ${'B?'}      | ${'b'}
    ${'email but questABis null'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${null}      | ${'b'}
    ${'email but ansA is null'}             | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${null}
    ${'email but name is empty'}            | ${''}               | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is empty'}           | ${'elbertsoftware'} | ${''}                                | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is empty'}        | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${''}          | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is empty'}          | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${''}        | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is empty'}            | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${''}        | ${'B?'}      | ${'b'}
    ${'email but questABis empty'}          | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${''}        | ${'b'}
    ${'email but ansA is empty'}            | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${''}
    ${'email but name whitespaces'}         | ${'  '}             | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email whitespaces'}        | ${'elbertsoftware'} | ${'  '}                              | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password whitespaces'}     | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'  '}        | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA whitespaces'}       | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'  '}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA whitespaces'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'  '}      | ${'B?'}      | ${'b'}
    ${'email but questA whitespaces'}       | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'  '}      | ${'b'}
    ${'email but ansA whitespaces'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'  '}
    ${'email but name is empty'}            | ${'   '}            | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but email is empty'}           | ${'elbertsoftware'} | ${'   '}                             | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but password is empty'}        | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'   '}       | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but questA is empty'}          | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'   '}     | ${'a'}       | ${'B?'}      | ${'b'}
    ${'email but ansA is empty'}            | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'   '}     | ${'B?'}      | ${'b'}
    ${'email but questABis empty'}          | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'   '}     | ${'b'}
    ${'email but ansA is empty'}            | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined}    | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'   '}
    ${'phone but name is undefined'}        | ${undefined}        | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is undefined'}    | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${undefined}   | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is undefined'}   | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${undefined} | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is undefined'}     | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${undefined} | ${'B?'}      | ${'b'}
    ${'phone but questionB is undefined'}   | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${undefined} | ${'b'}
    ${'phone but answerB is undefined'}     | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${undefined}
    ${'phone but name is empty'}            | ${''}               | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is empty'}        | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${''}          | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is empty'}       | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${''}        | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is empty'}         | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${''}        | ${'B?'}      | ${'b'}
    ${'phone but questionB is empty'}       | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${''}        | ${'b'}
    ${'phone but answerB is empty'}         | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${''}
    ${'phone but name is whitespaces'}      | ${'  '}             | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is whitespaces'}  | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'  '}        | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is whitespaces'} | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'  '}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is whitespaces'}   | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'  '}      | ${'B?'}      | ${'b'}
    ${'phone but questionB is whitespaces'} | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'  '}      | ${'b'}
    ${'phone but answerB is whitespaces'}   | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'  '}
    ${'phone but name is null'}             | ${null}             | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but password is null'}         | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${null}        | ${'A?'}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but questionA is null'}        | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${null}      | ${'a'}       | ${'B?'}      | ${'b'}
    ${'phone but answerA is null'}          | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${null}      | ${'B?'}      | ${'b'}
    ${'phone but questionB is null'}        | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${null}      | ${'b'}
    ${'phone but answerB is null'}          | ${'elbertsoftware'} | ${undefined}                         | ${'0386824579'} | ${'!dcba4321'} | ${'A?'}      | ${'a'}       | ${'B?'}      | ${null}
    ${'null of all'}                        | ${undefined}        | ${undefined}                         | ${undefined}    | ${undefined}   | ${undefined} | ${undefined} | ${undefined} | ${undefined}
    ${'null of all'}                        | ${''}               | ${''}                                | ${''}           | ${''}          | ${''}        | ${''}        | ${''}        | ${''}
    ${'null of all'}                        | ${'  '}             | ${'  '}                              | ${'  '}         | ${'  '}        | ${'  '}      | ${'  '}      | ${'  '}      | ${'  '}
    ${'null of all'}                        | ${null}             | ${null}                              | ${null}         | ${null}        | ${null}      | ${null}      | ${null}      | ${null}
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
    description                                  | name                | email                                                                             | phone                  | password       | questionA | answerA | questionB | answerB
    ${'invalid email: not trimmed'}              | ${'elbertsoftware'} | ${'  elbertsoftware.tester@gmail  '}                                              | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of domain'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail'}                                                  | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of domain'}           | ${'elbertsoftware'} | ${'elbertsoftware.tester@'}                                                       | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of @ domain'}         | ${'elbertsoftware'} | ${'elbertsoftware.tester'}                                                        | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of @ domain'}         | ${'elbertsoftware'} | ${'elbertsoftware'}                                                               | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of mailbox'}          | ${'elbertsoftware'} | ${'@gmail.com.io'}                                                                | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of mailbox'}          | ${'elbertsoftware'} | ${'@gmail.com'}                                                                   | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: lack of mailbox & domain'} | ${'elbertsoftware'} | ${'@gmail'}                                                                       | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: double @'}                 | ${'elbertsoftware'} | ${'elbertsoftware@tester@gmail.com'}                                              | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: double @'}                 | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail@com'}                                              | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: special characters'}       | ${'elbertsoftware'} | ${'~!#$%@gmail.com'}                                                              | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: special character'}        | ${'elbertsoftware'} | ${'elbertsoftware&tester@gmail.com'}                                              | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: space'}                    | ${'elbertsoftware'} | ${'elbertsoftware tester@gmail.com'}                                              | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid email: over 64 characters'}       | ${'elbertsoftware'} | ${'1234567890123456789012345678901234567890123456789012345678901234+x@gmail.com'} | ${undefined}           | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: not trimmed'}              | ${'elbertsoftware'} | ${undefined}                                                                      | ${'  +840386824579  '} | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: has dash'}                 | ${'elbertsoftware'} | ${undefined}                                                                      | ${'-+840386824579'}    | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: has splash'}               | ${'elbertsoftware'} | ${undefined}                                                                      | ${'/+840386824579'}    | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: has letter'}               | ${'elbertsoftware'} | ${undefined}                                                                      | ${'a+840386824579'}    | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: has letter'}               | ${'elbertsoftware'} | ${undefined}                                                                      | ${'+8438682457a9'}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: has singlequote'}          | ${'elbertsoftware'} | ${undefined}                                                                      | ${"'+840386824579"}    | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid phone: has singlequote'}          | ${'elbertsoftware'} | ${undefined}                                                                      | ${"+8438682457'9"}     | ${'!dcba4321'} | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: only numbers'}               | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'12345678'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: lack of letter'}             | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'1234567!'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: lack of special letter'}     | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'1234567a'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: only letters'}               | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'abcdefgh'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: lack of number'}             | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'abcdefg!'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: lack of special character'}  | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'abcdefg1'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwd: only special characters'}    | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'~!@#$%^&'}  | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
    ${'invalid pwdL < 6 character'}              | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'}                                              | ${undefined}           | ${'ab12!'}     | ${'A?'}   | ${'a'}  | ${'B?'}   | ${'b'}
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
    `Should create user by: $description`,
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
    ${'user is exised and enabled'} | ${'seedUserOneId'}
  `(`Should not resend confirmation code since $description : $userId`, async ({ userId }) => {
    const variables = {
      userId: userId === 'seedUserOneId' ? seedUserOne.user.id : userId,
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
    description                   | email                   | phone            | password
    ${'by email but pwd null'}    | ${'john@example.com'}   | ${undefined}     | ${''}
    ${'by email but pwd null'}    | ${'john@example.com'}   | ${undefined}     | ${null}
    ${'by email but pwd null'}    | ${'john@example.com'}   | ${undefined}     | ${undefined}
    ${'by email but email null'}  | ${''}                   | ${undefined}     | ${'!abcd1234'}
    ${'by email but email null'}  | ${null}                 | ${undefined}     | ${'!abcd1234'}
    ${'by email but email null'}  | ${undefined}            | ${undefined}     | ${'!abcd1234'}
    ${'by phone but phone null'}  | ${undefined}            | ${''}            | ${'!abcd1234'}
    ${'by phone but phone null'}  | ${undefined}            | ${null}          | ${'!abcd1234'}
    ${'by phone but phone null'}  | ${undefined}            | ${undefined}     | ${'!abcd1234'}
    ${'by phone but pwd null'}    | ${undefined}            | ${'01234567890'} | ${''}
    ${'by phone but pwd null'}    | ${undefined}            | ${'01234567890'} | ${null}
    ${'by phone but pwd null'}    | ${undefined}            | ${'01234567890'} | ${undefined}
    ${'as all null'}              | ${''}                   | ${''}            | ${''}
    ${'as all null'}              | ${null}                 | ${null}          | ${null}
    ${'as all null'}              | ${undefined}            | ${undefined}     | ${undefined}
    ${'by email but wrong pwd'}   | ${'john@example.com'}   | ${undefined}     | ${'abcd1234'}
    ${'by phone but wrong pwd'}   | ${undefined}            | ${'0123456789'}  | ${'abcd1234'}
    ${'by email but wrong email'} | ${'hijohn@example.com'} | ${undefined}     | ${'abcd1234'}
    ${'by phone but wrong phone'} | ${undefined}            | ${'0987654321'}  | ${'abcd1234'}
  `(`Should not log in $description`, async ({ email, phone, password }) => {
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
    description                | userId            | code
    ${'lacking of inputs'}     | ${undefined}      | ${undefined}
    ${'lacking of userId'}     | ${undefined}      | ${'seedUserFour'}
    ${'lacking of code'}       | ${'seedUserFour'} | ${undefined}
    ${'using an invalid code'} | ${'seedUserFour'} | ${'a1b2c3'}
    ${'using an invalid code'} | ${'seedUserFour'} | ${'seedUserFive'}
  `(`Should not confirm user 4 account because of: $description`, async ({ userId, code }) => {
    const variables = {
      data: {
        userId: userId === 'seedUserFour' ? seedUserFour.user.id : userId,
        code:
          code === 'seedUserFive'
            ? seedUserFive.confirmCode
            : code === 'seedUserFour'
            ? seedUserFour.confirmCode
            : code,
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

describe(`Update user's profile`, () => {
  test.each`
    description           | name         | oldemail               | oldphone        | email                  | phone           | password       | currentPassword | enabled      | expected
    ${'change name'}      | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'name'}
    ${'change email'}     | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${'johnX@example.com'} | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'email'}
    ${'change questionA'} | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionA'}
    ${'change answerA'}   | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerA'}
    ${'change questionB'} | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionB'}
    ${'change answerB'}   | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerB'}
    ${'change name'}      | ${'updated'} | ${undefined}           | ${'0123455555'} | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'name'}
    ${'change email'}     | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}           | ${'0987654321'} | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'phone'}
    ${'change questionA'} | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionA'}
    ${'change answerA'}   | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerA'}
    ${'change questionB'} | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionB'}
    ${'change answerB'}   | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}           | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerB'}
    ${'change pwd'}       | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}           | ${undefined}    | ${'!dcba4321'} | ${'!abcd1234'}  | ${undefined} | ${'password'}
    ${'change all'}       | ${'updated'} | ${'john5@example.com'} | ${'0123455555'} | ${'johnX@example.com'} | ${'0987654321'} | ${'!dcba4321'} | ${'!abcd1234'}  | ${undefined} | ${'all'}
  `(
    `Should update user: $description`,
    async ({ name, oldemail, oldphone, email, phone, password, currentPassword, enabled, expected }) => {
      // login
      let variables = {
        data: {
          email: oldemail,
          phone: oldphone,
          password: currentPassword,
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
          name: name,
          email: email,
          phone: phone,
          password: password,
          currentPassword: currentPassword,
        },
      };
      const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });

      expect(data.updateUser.id).toBe(seedUserFive.user.id);

      if (expected === 'name') {
        expect(data.updateUser.name).not.toBe(seedUserFive.user.name);
        return;
      }
      if (expected === 'email') {
        expect(data.updateUser.email).not.toBe(seedUserFive.user.email);
        expect(data.updateUser.enabled).toBe(false);
        return;
      }
      if (expected === 'phone') {
        expect(data.updateUser.phone).not.toBe(seedUserFive.user.phone);
        expect(data.updateUser.enabled).toBe(false);
        return;
      }
      if (expected === 'all') {
        expect(data.updateUser.name).not.toBe(seedUserFive.user.name);
        expect(data.updateUser.email).not.toBe(seedUserFive.user.email);
        expect(data.updateUser.phone).not.toBe(seedUserFive.user.phone);
        expect(data.updateUser.enabled).toBe(false);
      }

      // TODO: try to confirm password has changed
    },
  );

  test.each`
    description              | name         | oldemail               | oldphone        | email                                                                             | phone           | password       | currentPassword | enabled      | expected
    ${'empty new name'}      | ${''}        | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'name'}
    ${'empty new email'}     | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${''}                                                                             | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'email'}
    ${'empty new questionA'} | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionA'}
    ${'empty new answerA'}   | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerA'}
    ${'empty new questionB'} | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionB'}
    ${'empty new answerB'}   | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerB'}
    ${'wrong authen'}        | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'abcd1234'}   | ${undefined} | ${'authenfailed'}
    ${'account not existed'} | ${'updated'} | ${'john6@example.com'} | ${undefined}    | ${'johnX@example.com'}                                                            | ${'0987654321'} | ${'!dcba4321'} | ${'!abcd1234'}  | ${undefined} | ${'wrongaccount'}
    ${'invalid new pwd'}     | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${'ab12!'}     | ${'!abcd1234'}  | ${undefined} | ${'invalidNewPwd'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware.tester@gmail'}                                                  | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware.tester@'}                                                       | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware.tester'}                                                        | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware'}                                                               | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'@gmail.com.io'}                                                                | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'@gmail.com'}                                                                   | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'@gmail'}                                                                       | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware@tester@gmail.com'}                                              | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware.tester@gmail@com'}                                              | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'~!#$%@gmail.com'}                                                              | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware&tester@gmail.com'}                                              | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'elbertsoftware tester@gmail.com'}                                              | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'invalid new mail'}    | ${'updated'} | ${'john5@example.com'} | ${undefined}    | ${'1234567890123456789012345678901234567890123456789012345678901234+x@gmail.com'} | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'invalidNewMail'}
    ${'empty new name'}      | ${''}        | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'name'}
    ${'empty new phone'}     | ${undefined} | ${undefined}           | ${'0123455555'} | ${''}                                                                             | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'email'}
    ${'empty new questionA'} | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionA'}
    ${'empty new answerA'}   | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerA'}
    ${'empty new questionB'} | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'questionB'}
    ${'empty new answerB'}   | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'answerB'}
    ${'empty all'}           | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'all'}
    ${'wrong authen'}        | ${undefined} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'abcd1234'}   | ${undefined} | ${'authenfailed'}
    ${'account not existed'} | ${'updated'} | ${undefined}           | ${'0123455556'} | ${undefined}                                                                      | ${'0987654321'} | ${'!dcba4321'} | ${'!abcd1234'}  | ${undefined} | ${'wrongaccount'}
    ${'invalid new pwd'}     | ${'updated'} | ${undefined}           | ${'0123455555'} | ${undefined}                                                                      | ${undefined}    | ${'ab12!'}     | ${'!abcd1234'}  | ${undefined} | ${'invalidNewPwd'}
    ${'empty all'}           | ${undefined} | ${'john5@example.com'} | ${undefined}    | ${undefined}                                                                      | ${undefined}    | ${undefined}   | ${'!abcd1234'}  | ${undefined} | ${'all'}
  `(
    `Should not update user because of $description`,
    async ({ name, oldemail, oldphone, email, phone, password, currentPassword, enabled, expected }) => {
      // login
      let variables = {
        data: {
          email: oldemail,
          phone: oldphone,
          password: currentPassword,
        },
      };

      if (expected === 'authenfailed' || expected === 'wrongaccount') {
        await expect(
          graphQLClient.mutate({
            mutation: operations.login,
            variables,
          }),
        ).rejects.toThrow();
        return;
      }

      const res = await graphQLClient.mutate({
        mutation: operations.login,
        variables,
      });

      // and then query profile
      const graphQLClientWithToken = getGraphQLClient(res.data.login.token);
      variables = {
        data: {
          name: name,
          email: email,
          phone: phone,
          password: password,
          currentPassword: currentPassword,
        },
      };

      if (expected === 'invalidNewPwd' || expected === 'invalidNewMail') {
        await expect(graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables })).rejects.toThrow();
        return;
      }

      const { data } = await graphQLClientWithToken.mutate({ mutation: operations.updateUser, variables });

      expect(data.updateUser.id).toBe(seedUserFive.user.id);

      if (expected === 'name') {
        expect(data.updateUser.name).toBe(seedUserFive.user.name);
        return;
      }
      if (expected === 'email') {
        expect(data.updateUser.email).toBe(seedUserFive.user.email);
        expect(data.updateUser.enabled).toBe(true);
        return;
      }
      if (expected === 'phone') {
        expect(data.updateUser.phone).toBe(seedUserFive.user.phone);
        expect(data.updateUser.enabled).toBe(true);
        return;
      }
      if (expected === 'password') {
        expect(auth.hashPassword(data.updateUser.password)).toBe(seedUserFive.user.password);
        return;
      }
      if (expected === 'all') {
        expect(data.updateUser.name).toBe(seedUserFive.user.name);
        expect(data.updateUser.email).toBe(seedUserFive.user.email);
        expect(data.updateUser.phone).toBe(seedUserFive.user.phone);
        expect(data.updateUser.enabled).toBe(true);
      }
    },
  );
});

// /**
//  *
//  *  --- DELETE USER ---
//  *
//  */

describe(`Delete User`, () => {
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

  test('Should not delete user because user does not log in', async () => {
    await expect(graphQLClient.mutate({ mutation: operations.deleteUser })).rejects.toThrow();
  });
});

/**
 *
 *  --- RESET PWD ---
 *
 */

describe(`Reset PWD`, () => {
  describe(`Step1: Make an request reset password`, () => {
    test.each`
      description   | email                  | phone           | questionA | question B
      ${'by email'} | ${'john5@example.com'} | ${undefined}    | ${'A?'}   | ${'B?'}
      ${'by phone'} | ${undefined}           | ${'0123455555'} | ${'A?'}   | ${'B?'}
    `(
      'Should return token & questions when user makes a resetPWD request $description',
      async ({ email, phone, questionA, questionB }) => {
        const variables = {
          data: {
            email: email,
            phone: phone,
          },
        };
        const { data } = await graphQLClient.mutate({ mutation: operations.requestResetPwd, variables });
        expect(data.requestResetPwd.token.length).toBeGreaterThanOrEqual(32);
        expect(data.requestResetPwd.questionA).toBeTruthy();
        expect(data.requestResetPwd.questionA).toBe(questionA);
        expect(data.requestResetPwd.questionB).toBeTruthy();
        expect(data.requestResetPwd.questionB).toBe(questionB);
      },
    );

    test.each`
      description             | email                      | phone
      ${'by unexisted email'} | ${'hellojohn@example.com'} | ${undefined}
      ${'by unexisted phone'} | ${undefined}               | ${'0987654321'}
      ${'empty input'}        | ${undefined}               | ${undefined}
      ${'empty input'}        | ${''}                      | ${undefined}
      ${'empty input'}        | ${undefined}               | ${null}
    `(
      'Should not return token & questions when user makes an invalid resetPWD request $description',
      async ({ email, phone }) => {
        const variables = {
          data: {
            email: email,
            phone: phone,
          },
        };
        await expect(graphQLClient.mutate({ mutation: operations.requestResetPwd, variables })).rejects.toThrow();
      },
    );
  });

  describe(`Step2: Verify identity by answering some securty questions and reset pwd`, () => {
    let token = '';
    beforeEach(async () => {
      const variables = {
        data: {
          email: 'john5@example.com',
        },
      };
      const { data } = await graphQLClient.mutate({ mutation: operations.requestResetPwd, variables });
      token = data.requestResetPwd.token;
    });

    test(`Should verify user and reset pwd`, async () => {
      expect(token.length).toBeGreaterThanOrEqual(32);
      const graphQLClientWithToken = getGraphQLClient(token);
      let variables = {
        data: {
          answerA: 'a',
          answerB: 'b',
          password: '@cdef5678',
        },
      };
      const { data } = await graphQLClientWithToken.mutate({ mutation: operations.resetPassword, variables });
      expect(data.resetPassword).toBeTruthy();

      // should login with new pwd
      variables = {
        data: {
          email: 'john5@example.com',
          password: '@cdef5678',
        },
      };
      const res = await graphQLClient.mutate({
        mutation: operations.login,
        variables,
      });
      expect(res.data.login.token.length).toBeGreaterThan(32);
    });

    test.each`
      description        | answerA      | answerB      | password       | rule
      ${'no token'}      | ${'a'}       | ${'b'}       | ${'@cdef5678'} | ${'noToken'}
      ${'no answerA'}    | ${undefined} | ${'b'}       | ${'@cdef5678'} | ${'token'}
      ${'no answerB'}    | ${'a'}       | ${undefined} | ${'@cdef5678'} | ${'token'}
      ${'no answers'}    | ${undefined} | ${undefined} | ${'@cdef5678'} | ${'token'}
      ${'wrong answer'}  | ${'c'}       | ${'b'}       | ${'@cdef5678'} | ${'token'}
      ${'wrong answer'}  | ${'a'}       | ${'c'}       | ${'@cdef5678'} | ${'token'}
      ${'wrong answers'} | ${'c'}       | ${'d'}       | ${'@cdef5678'} | ${'token'}
      ${'wrong pwd'}     | ${'a'}       | ${'b'}       | ${'@ab12'}     | ${'token'}
    `(`Should not verify user's identity because of $description`, async ({ answerA, answerB, password, rule }) => {
      const graphQLClientWithToken = getGraphQLClient(rule === 'noToken' ? null : token);
      const variables = {
        data: {
          answerA: answerA,
          answerB: answerB,
          password: password,
        },
      };
      await expect(graphQLClientWithToken.mutate({ mutation: operations.resetPassword, variables })).rejects.toThrow();
    });
  });
});

describe(`Testing with ngrok`, async () => {
  let url;
  let xClient;
  // Open a tunnel before runing all tests
  // and make sure that ngrok return the url that we're going to pass into the apollo booost
  beforeAll(async () => {
    url = await ngrok.connect({
      proto: 'http',
      addr: '127.0.0.1:5000',
    });
    console.log('TEST ngrok tunnel is up');
    console.log('TEST Tunnel is: ' + url);
    xClient = getGraphQLClientWithTunnel(null, url);
  }, 10000);

  // Close tunnel after running all tests (this is important)
  afterAll(async () => {
    await ngrok.disconnect();
    await ngrok.kill();
    console.log('TEST ngrok tunnel is down');
  });

  beforeEach(seedTestData);

  /**
   *
   *  --- SIGN UP ---
   *
   */

  test(`Should one userId has two tokens with different ip in cache`, async () => {
    // local ip
    let variables = {
      data: {
        email: 'john@example.com',
        password: '!abcd1234',
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
        phone: '0123456789',
        password: '!abcd1234',
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
        email: 'john@example.com',
        password: '!abcd1234',
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
        phone: '0123456789',
        password: '!abcd1234',
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

  test(`Should tokens are deleted since it is expired`, async () => {
    let variables = {
      data: {
        email: 'john@example.com',
        password: '!abcd1234',
      },
    };
    const res1 = await graphQLClient.mutate({
      mutation: operations.login,
      variables,
    });
    expect(res1.data.login.token.length).toBeGreaterThan(32);

    // wait 5s and check the cache
    setTimeout(async () => {
      const cacheData = await cache.hgetall(seedUserOne.user.id);
      expect(Object.keys(cacheData).length).toBe(0);
    }, 5000);
  });
});

describe('Get language', () => {
  const client = getGraphQLClient();
  test(`Should get language from client`, () => {
    expect();
  });
});
