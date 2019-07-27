// @flow

import fs from "fs";
import http from "http";
import express from "express";
import requestLanguage from "express-request-language";
import { pick } from "accept-language-parser";
import helmet from "helmet";
import bodyParser from "body-parser";

import { ApolloServer, PubSub } from "apollo-server-express";

import i18n from "./utils/i18nHelper";

import { resolvers, fragmentReplacements } from "./resolvers";
import { schema as typeDefs } from "./type-defs";
import prisma from "./utils/prisma";
import cache from "./utils/cache";
import logger from "./utils/logger";
import { getUserIDFromRequest } from "./utils/authentication";

// Express server
const server = express();

// helmet to protect the server from HTTP based attacks
// TODO: only 7 default ones are used, review another then add them later
server.use(helmet());

// body parser middleware to parse application/json based body: authorization token
server.use(bodyParser.json());

server.use(
  requestLanguage({
    languages: i18n.availableLanguages.sort(), // First locale becomes the default
  }),
);

// other middlewares goes here, like passport, etc.
// server.use(passport.initialize());
// configurePassport(passport);

// const path = 'aPath'
// server.use(path, aMiddleware)

// GraphQL server using Apollo Server 2.x with Middleware option
// const typeDefs = gql`
//   ${fs.readFileSync(__dirname.concat('/type-defs/schema.graphql'), 'utf8')}
// `;

const pubsub = new PubSub();

const graphQLServer = new ApolloServer({
  typeDefs, // link this graphql server to our implemented schema
  resolvers, // and our implemented resolvers
  context: ({ req: request /* , res: response */, connection }) => {
    // reference req -> request, res -> response
    let languageCode = i18n.availableLanguages.sort()[0];

    // extract language code from http request or socket connection
    if (connection && connection.context["Accept-Language"]) {
      languageCode = pick(
        i18n.availableLanguages.sort(),
        connection.context["Accept-Language"],
      );
    } else if (request && request.language) {
      languageCode = request.language;
    }

    // activate language before performing action
    i18n.activate(languageCode);
    logger.debug(`🉑  ACTIVATED LANGUAGE: ${languageCode}`);

    return {
      prisma,
      request,
      cache,
      i18n,
      pubsub,
      connection,
    };
  },
  // subscription authentication
  //
  // subscriptions: {
  //   onConnect: async (connection, webSocket) => {
  // console.log(connection);
  // const userId = await getUserIDFromRequest(connection);
  // console.log(userId);
  // if (connectionParams) {
  // return validateToken(connectionParams.authToken)
  //   .then(findUser(connectionParams.authToken))
  //   .then(user => {
  //     return {
  //       currentUser: user,
  //     };
  //   });
  // }
  // throw new Error("Missing auth token!");
  // },
  // },
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 2097152, // 2 MB
    maxFiles: 5, // upload to 5 files at same time
  },
  fragmentReplacements, // send fragment definitions to this graphql server
});

graphQLServer.applyMiddleware({ app: server }); // reference app to server

// in case collocated path
// graphQLServer.applyMiddleware({ app: server, path });

// install subscription handler
const httpServer = http.createServer(server);
graphQLServer.installSubscriptionHandlers(httpServer);

logger.info(`⚡ Server ready at endpoint: ${graphQLServer.graphqlPath}`);
logger.info(
  `⚡ Subscriptions ready at endpoint: ${graphQLServer.subscriptionsPath}`,
);

export default httpServer;
