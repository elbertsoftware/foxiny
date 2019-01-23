// @flow

import { extractFragmentReplacements } from 'prisma-binding';

import logger from '../utils/logger';

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
logger.debug(`fragmentReplacements ${JSON.stringify(fragmentReplacements)}`);

export { resolvers, fragmentReplacements };
