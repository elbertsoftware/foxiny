// @flow

import { extractFragmentReplacements } from 'prisma-binding';

import Query from './Query';
import Mutation from './Mutation';
// import Subscription from './Subscription'
import User from './User';

const resolvers = {
  Query,
  Mutation,
  // Subscription,
  User,
};

// extractFragmentReplacements() goes thru all resolvers and retrieve fragment definitions
const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
