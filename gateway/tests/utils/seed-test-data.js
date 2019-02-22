// @flow

import prisma from '../../src/utils/prisma';
import { hashPassword, generateToken, generateConfirmation } from '../../src/utils/authentication';
import cache from '../../src/utils/cache';
import logger from '../../src/utils/logger';

const securityQuestions = [{ question: 'A?' }, { question: 'B?' }, { question: 'C?' }];

/**
 * seed security questions
 */
let questions = [];
(async () => {
  await prisma.mutation.deleteManySecurityQuestions();
  securityQuestions.forEach(async question => {
    const q = await prisma.mutation.createSecurityQuestion({ data: question });
    questions.push(q);
  });
})();

const seedUserOne = {
  data: {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '0123456789',
    password: hashPassword('!abcd1234'),
    enabled: true,
  },
  user: undefined,
  token: undefined,
};
const seedUserTwo = {
  data: {
    name: 'John Smith 2',
    email: 'john2@example.com',
    phone: '0123456788',
    password: hashPassword('!abcd1234'),
    enabled: true,
  },
  user: undefined,
  token: undefined,
};
const seedUserThree = {
  data: {
    name: 'John Smith 3',
    email: 'john3@example.com',
    phone: '0123456777',
    password: hashPassword('!abcd1234'),
    enabled: true,
  },
  user: undefined,
  token: undefined,
};
const seedUserFour = {
  data: {
    name: 'John Smith 4',
    email: 'john4@example.com',
    phone: '0123456666',
    password: hashPassword('!abcd1234'),
    enabled: false,
  },
  user: undefined,
};
const seedUserFive = {
  data: {
    name: 'John Smith 5',
    email: 'john5@example.com',
    phone: '0123455555',
    password: hashPassword('!abcd1234'),
    enabled: true,
  },
  user: undefined,
};

const seedTestData = async () => {
  // Delete test data & clean cache
  await prisma.mutation.deleteManyUsers();
  // clean cache
  await cache.flushall();

  // Seed user one
  seedUserOne.user = await prisma.mutation.createUser(
    {
      data: seedUserOne.data,
    },
    `{ id name email phone password securityAnswers { id securityQuestion { id question } } enabled createdAt updatedAt }`,
  );
  // Seed user two
  seedUserTwo.user = await prisma.mutation.createUser(
    {
      data: seedUserTwo.data,
    },
    `{ id name email phone password securityAnswers { id securityQuestion { id question } } enabled createdAt updatedAt }`,
  );
  // Seed user three
  seedUserThree.user = await prisma.mutation.createUser(
    {
      data: seedUserThree.data,
    },
    `{ id name email phone password securityAnswers { id securityQuestion { id question } } enabled createdAt updatedAt }`,
  );
  // Seed user four
  seedUserFour.user = await prisma.mutation.createUser(
    {
      data: seedUserFour.data,
    },
    `{ id name email phone password securityAnswers { id securityQuestion { id question } } enabled createdAt updatedAt }`,
  );
  // Seed user five
  seedUserFive.user = await prisma.mutation.createUser(
    {
      data: {
        ...seedUserFive.data,
        securityAnswers: {
          create: questions.map((q, i) => ({
            securityQuestion: {
              connect: {
                id: q.id,
              },
            },
            answer: i.toString(),
          })),
        },
      },
    },
    `{ id name email phone password securityAnswers { id securityQuestion { id question } } enabled createdAt updatedAt }`,
  );

  // seedUserOne.token = generateToken(seedUserOne.user.id);
  seedUserFour.confirmCode = generateConfirmation(cache, seedUserFour.user.id);
  seedUserFive.confirmCode = generateConfirmation(cache, seedUserFive.user.id);
};

export default seedTestData;
export { seedUserOne, seedUserFour, seedUserFive, questions };
