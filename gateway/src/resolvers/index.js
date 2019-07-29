// @flow

import { extractFragmentReplacements } from 'prisma-binding';
import { merge } from 'lodash';

import GraphQLJSON from 'graphql-type-json';

import logger from '../utils/logger';

import { Mutation as catalogMutations } from './Mutations/CatalogMutations';
import { Mutation as manufacturersMutations } from './Mutations/ManufacturerMutations';
import { Mutation as mediaMutations } from './Mutations/MediaMutations';
import { Mutation as productMutations } from './Mutations/ProductMutations';
import { Mutation as retailerMutations } from './Mutations/RetailerMutations';
import { Mutation as staffMutations } from './Mutations/StaffMutations';
import { Mutation as systemMutations } from './Mutations/SystemMutations';
import { Mutation as userMutations } from './Mutations/UserMutations';

// media queries
import { Query as catalogQueries } from './Queries/CatalogQueries';
import { Query as productQueries } from './Queries/ProductQueries';
import { Query as retailerQueries } from './Queries/RetailerQueries';
import { Query as staffQueries } from './Queries/StaffQueries';
import { Query as systemQueries } from './Queries/SystemQueries';
import { Query as userQueries } from './Queries/UserQueries';

// NOTE: SUBSCRIPTIONS
import { Subscriptions as subscriptions } from './Subscriptions/Subscription';

// NOTE: RESOLVERS
import { User } from './Resolvers/User';
import { Media } from './Resolvers/Media';

const resolvers = {
  Query: merge(
    catalogQueries,
    productQueries,
    retailerQueries,
    staffQueries,
    systemQueries,
    userQueries,
  ),
  Mutation: merge(
    catalogMutations,
    mediaMutations,
    productMutations,
    retailerMutations,
    staffMutations,
    systemMutations,
    userMutations,
  ),
  Subscription: subscriptions,
  User,
  Media,
  JSON: GraphQLJSON, // usung a custom scalar to handle JSON
};

// extractFragmentReplacements() goes thru all resolvers and retrieve fragment definitions
const fragmentReplacements = extractFragmentReplacements(resolvers);
logger.debug(`fragmentReplacements ${JSON.stringify(fragmentReplacements)}`);

export { resolvers, fragmentReplacements };
