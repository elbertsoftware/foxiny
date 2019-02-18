// @flow

// 'cross-fetch' is Fetch API polyfill which is needed by Apollo Boost to work in Node
import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/utils/prisma';
import getGraphQLClient, { getGraphQLClientWithTunnel } from './utils/get-graphql-client';
import seedTestData, {
  seedUserOne,
  seedUserFour,
  seedUserFive,
  seedSecurityQuestions,
  questions,
} from './utils/seed-test-data';
import operations from './utils/operations';
import logger from '../src/utils/logger';
import cache from '../src/utils/cache';
import * as auth from '../src/utils/authentication';

const ngrok = require('ngrok');
const graphQLClient = getGraphQLClient();

// TODO: tests each small functions before mutations testing

describe(`User test`, () => {
  // seeds database
  beforeEach(seedTestData);

  describe('Local ip', () => {
    // get questions

    /**
     *
     *  --- SIGN UP ---
     *
     */
    // ${'email but name is undefined'}      | ${undefined}        | ${'elbertsoftware.tester@gmail.com'} | ${undefined} | ${'!dcba4321'} | ${questions.map((q, i) => ({ questionId: q.id, answer: i.toString() }))}
    // ${'email but email is undefined'}     | ${'elbertsoftware'} | ${undefined}                         | ${undefined} | ${'!dcba4321'} | ${questions.map((q, i) => ({ questionId: q.id, answer: i.toString() }))}
    // ${'email but password is undefined'}  | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined} | ${undefined}   | ${questions.map((q, i) => ({ questionId: q.id, answer: i.toString() }))}
    // ${'email but questions is undefined'} | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined} | ${'!dcba4321'} | ${questions.map((q, i) => ({ questionId: undefined, answer: i.toString() }))}
    // ${'email but answer is undefined'}    | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined} | ${'!dcba4321'} | ${questions.map((q, i) => ({ questionId: q.id, answer: undefined }))}
    // ${'email but lacking of secInfo'}     | ${'elbertsoftware'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined} | ${'!dcba4321'} | ${questions.map((q, i) => ({ questionId: q.id, answer: i.toString() })).slice(0, 1)}
    // ${'undefined of all'}                 | ${undefined}        | ${undefined}                         | ${undefined} | ${undefined}   | ${[{ questionId: undefined, answer: undefined }, { questionId: undefined, answer: undefined }, { questionId: undefined, answer: undefined }]}
    // ${'null of all'}                      | ${''}               | ${''}                                | ${''}        | ${''}          | ${[{ questionId: '', answer: '' }, { questionId: '', answer: '' }, { questionId: '', answer: '' }]}
    // ${'whitespaces of all'}               | ${'  '}             | ${'  '}                              | ${'  '}      | ${'  '}        | ${[{ questionId: '   ', answer: '   ' }, { questionId: '   ', answer: '   ' }, { questionId: '   ', answer: '   ' }]}
    // ${'null of all'}                      | ${null}             | ${null}                              | ${null}      | ${null}        | ${[{ questionId: null, answer: null }, { questionId: null, answer: null }, { questionId: null, answer: null }]}
    describe(`Creates a user`, () => {
      test.each`
        description                      | name        | email                                | phone        | password       | securityInfo
        ${'email but name is undefined'} | ${'elbert'} | ${'elbertsoftware.tester@gmail.com'} | ${undefined} | ${'!dcba4321'} | ${questions}
      `(`Should not create user by: $description`, async ({ name, email, phone, password, securityInfo }) => {
        logger.debug(JSON.stringify(securityInfo, undefined, 2));
        const variables = {
          data: {
            name: name,
            email: email,
            phone: phone,
            password: password,
            securityInfo: securityInfo,
          },
        };
        logger.debug(JSON.stringify(variables));
        await expect(graphQLClient.mutate({ mutation: operations.createUser, variables })).rejects.toThrow();
      });
    });
  });
});
