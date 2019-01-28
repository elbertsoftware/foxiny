// @flow

import prisma from '../../src/utils/prisma';
import { hashPassword, generateToken, generateConfirmation } from '../../src/utils/authentication';
import cache from '../../src/utils/cache';
import logger from '../../src/utils/logger';

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
    questionA: 'A?',
    answerA: 'a',
    questionB: 'B?',
    answerB: 'b',
    enabled: true,
  },
  user: undefined,
};

const seedTestData = async () => {
  // Delete test data
  await prisma.mutation.deleteManyUsers();

  // Seed user one
  seedUserOne.user = await prisma.mutation.createUser({
    data: seedUserOne.data,
  });
  // Seed user two
  seedUserTwo.user = await prisma.mutation.createUser({
    data: seedUserTwo.data,
  });
  // Seed user three
  seedUserThree.user = await prisma.mutation.createUser({
    data: seedUserThree.data,
  });
  // Seed user four
  seedUserFour.user = await prisma.mutation.createUser({
    data: seedUserFour.data,
  });
  // Seed user five
  seedUserFive.user = await prisma.mutation.createUser({
    data: seedUserFive.data,
  });

  // seedUserOne.token = generateToken(seedUserOne.user.id);
  seedUserFour.confirmCode = generateConfirmation(cache, seedUserFour.user.id);
  seedUserFive.confirmCode = generateConfirmation(cache, seedUserFive.user.id);
};

export default seedTestData;
export { seedUserOne, seedUserFour, seedUserFive };
