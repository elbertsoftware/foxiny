// @flow

import { extractFragmentReplacements } from 'prisma-binding';
import { merge } from 'lodash';

import logger from '../utils/logger';

import { Query as userQueries } from './Queries/UserQueries';
import { Mutation as userMutations } from './Mutations/UserMutations';
import { Query as categoryQueries } from './Queries/CategoryQueries';
import { Mutation as categoryMutations } from './Mutations/CategoryMutations';
import { Query as productQueries } from './Queries/ProductQueries';
import { Mutation as productMutations } from './Mutations/ProductMutations';
// product queries
import { Mutation as retailerMutations } from './Mutations/RetailerMutations';
import { Query as retailerQueries } from './Queries/RetailerQueries';
import { Mutation as mediaMutations } from './Mutations/MediaMutations';
// media queries

// import Subscription from './Subscription'
import { User } from './Resolvers/User';
import { Media } from './Resolvers/Media';

const resolvers = {
  Query: merge(userQueries, categoryQueries, productQueries, retailerQueries),
  Mutation: merge(userMutations, categoryMutations, productMutations, retailerMutations, mediaMutations),
  // Subscription,
  User,
  Media,
};

// extractFragmentReplacements() goes thru all resolvers and retrieve fragment definitions
const fragmentReplacements = extractFragmentReplacements(resolvers);
logger.debug(`fragmentReplacements ${JSON.stringify(fragmentReplacements)}`);

export { resolvers, fragmentReplacements };
