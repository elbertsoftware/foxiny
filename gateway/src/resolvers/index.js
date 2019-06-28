// @flow

import { extractFragmentReplacements } from 'prisma-binding';
import { merge } from 'lodash';

import GraphQLJSON from 'graphql-type-json';

import logger from '../utils/logger';

import { Query as userQueries } from './Queries/UserQueries';
import { Mutation as userMutations } from './Mutations/UserMutations';
import { Query as catalogQueries } from './Queries/CatalogQueries';
import { Mutation as catalogMutations } from './Mutations/CatalogMutations';
import { Query as productQueries } from './Queries/ProductQueries';
import { Mutation as productMutations } from './Mutations/ProductMutations';
// product queries
import { Mutation as retailerMutations } from './Mutations/RetailerMutations';
import { Query as retailerQueries } from './Queries/RetailerQueries';
import { Mutation as mediaMutations } from './Mutations/MediaMutations';

import { Mutation as staffMutations } from './Mutations/StaffMutations';
import { Query as staffQueries } from './Queries/StaffQueries';
// media queries

// import Subscription from './Subscription'
import { User } from './Resolvers/User';
import { Media } from './Resolvers/Media';

const resolvers = {
  Query: merge(userQueries, catalogQueries, productQueries, retailerQueries, staffQueries),
  Mutation: merge(userMutations, catalogMutations, productMutations, retailerMutations, mediaMutations, staffMutations),
  // Subscription,
  User,
  Media,
  JSON: GraphQLJSON, // usung a custom scalar to handle JSON
};

// extractFragmentReplacements() goes thru all resolvers and retrieve fragment definitions
const fragmentReplacements = extractFragmentReplacements(resolvers);
logger.debug(`fragmentReplacements ${JSON.stringify(fragmentReplacements)}`);

export { resolvers, fragmentReplacements };
