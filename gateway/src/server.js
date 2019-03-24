// @flow

import fs from 'fs';

import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import { ApolloServer, gql } from 'apollo-server-express';

import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './utils/prisma';
import cache from './utils/cache';
import logger from './utils/logger';

// Express server
const server = express();

// helmet to protect the server from HTTP based attacks
// TODO: only 7 default ones are used, review another then add them later
server.use(helmet());

// body parser middleware to parse application/json based body: authorization token
server.use(bodyParser.json());

// other middlewares goes here, like passport, etc.
// server.use(passport.initialize());
// configurePassport(passport);

// const path = 'aPath'
// server.use(path, aMiddleware)

// GraphQL server using Apollo Server 2.x with Middleware option
const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat('/type-defs/schema.graphql'), 'utf8')}
`;

const graphQLServer = new ApolloServer({
  typeDefs, // link this graphql server to our implemented schema
  resolvers, // and our implemented resolvers
  context: ({ req: request /* , res: response */ }) => {
    // reference req -> request, res -> response
    return {
      prisma,
      request,
      cache,
    };
  },
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 1024, // 1MB
    maxFiles: 5, // at the same time
  },
  fragmentReplacements, // send fragment definitions to this graphql server
});

graphQLServer.applyMiddleware({ app: server }); // reference app to server

// in case collocated path
// graphQLServer.applyMiddleware({ app: server, path });

logger.info(`⚡ GraphQL endpoint: ${graphQLServer.graphqlPath}`);

export default server;
