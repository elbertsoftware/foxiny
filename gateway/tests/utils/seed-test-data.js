// @flow

import prisma from '../../src/utils/prisma';
import { hashPassword, generateToken, generateConfirmation } from '../../src/utils/authentication';
import cache from '../../src/utils/cache';
import logger from '../../src/utils/logger';

const seedUserOne = {
  data: {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+840386824579',
    password: hashPassword('!abcd1234'),
    enabled: true,
  },
  password: '!abcd1234',
  user: undefined,
  token: undefined,
};
const seedUserTwo = {
  data: {
    name: 'John Smith 2 does not activated',
    email: 'john2@example.com',
    phone: '0123456789',
    password: hashPassword('!abcd1234'),
    enabled: false,
  },
  password: '!abcd1234',
  user: undefined,
  token: undefined,
};
const seedUserThree = {
  data: {
    name: 'John Smith 3 has security info',
    email: 'john3@example.com',
    phone: '0123456799',
    password: hashPassword('!abcd1234'),
    enabled: true,
    recoverable: true,
  },
  password: '!abcd1234',
  user: undefined,
  token: undefined,
};

const seedTestData = async () => {
  // Delete test data & clean cache
  await prisma.mutation.deleteManyUsers();
  // clean cache
  await cache.flushall();

  const questions = await prisma.query.securityQuestions({ first: 3 }, `{ id question }`);

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
      data: {
        ...seedUserThree.data,
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
  seedUserTwo.confirmEmailCode = generateConfirmation(cache, seedUserTwo.user.id, 'john2@example.com');
  seedUserTwo.confirmPhoneCode = generateConfirmation(cache, seedUserTwo.user.id, '0123456788');
};

export default seedTestData;
export { seedUserOne, seedUserTwo, seedUserThree };

/**
 * --- SEED CACHE ---
 */

const seedCache = async () => {
  // clean cache
  await cache.flushall();
  await cache.set('aaaaaa', JSON.stringify({ userId: 'abc123', emailOrPhone: 'foxiny@foxiny.com' }));
  await cache.hset(
    'abc123',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYmMxMjMiLCJpYXQiOjE1NTIxMjc4NTM1NjksImV4cCI6MTU1MjEyNzg1MzU3Mn0.sGTuYSgFwqdX8x-VqcALJOtJXbtxu0zSp8dbbK5GJEc',
    JSON.stringify({ ip: '::1', createdAt: new Date().getTime() }),
  );
};

export { seedCache };
