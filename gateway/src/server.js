// @flow

import fs from 'fs';

import express from 'express';
import bodyParser from 'body-parser';

import { ApolloServer, gql } from 'apollo-server-express';

import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './prisma';

// Express server
const server = express();

// body parser middleware to parse application/json based body
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
    };
  },
  fragmentReplacements, // send fragment definitions to this graphql server
});

graphQLServer.applyMiddleware({ app: server }); // reference app to server

// in case collocated path
// graphQLServer.applyMiddleware({ app: server, path });

console.log(`🔗  GraphQL endpoint: ${graphQLServer.graphqlPath}`);

export default server;
