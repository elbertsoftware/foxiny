// @flow

import { GraphQLServer } from 'graphql-yoga';

import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './prisma';

// Our GraphQL server using graphql-yoga from Prisma
const graphQLServer = new GraphQLServer({
  typeDefs: './src/type-defs/schema.graphql', // link this graphql server to our implemented schema
  resolvers, // and our implemented resolvers
  context: request => {
    return {
      prisma,
      request,
    };
  },
  fragmentReplacements, // send fragment definitions to this graphql server
});

export default graphQLServer;
