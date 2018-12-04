// @flow

import prisma from '../../src/prisma';
import { hashPassword, generateToken } from '../../src/utils/authentication';

const seedUserOne = {
  data: {
    name: 'John Smith',
    email: 'john@example.com',
    password: hashPassword('abcd1234'),
  },
  user: undefined,
  token: undefined,
};

const seedTestData = async () => {
  // Delete test data
  await prisma.mutation.deleteManyUsers();

  // Seed user one
  seedUserOne.user = await prisma.mutation.createUser({
    data: seedUserOne.data,
  });

  seedUserOne.token = generateToken(seedUserOne.user.id);
};

export default seedTestData;
export { seedUserOne };
