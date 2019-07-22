// @flow

import fs from "fs";
import http from "http";
import express from "express";
import requestLanguage from "express-request-language";
import { pick } from "accept-language-parser";
import helmet from "helmet";
import bodyParser from "body-parser";

import { ApolloServer, PubSub } from "apollo-server-express";

// import { i18n, unpackCatalog } from "lingui-i18n"; // import i18n as something else
import { setupI18n } from "@lingui/core";

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

const i18n = setupI18n({
  catalogs: {
    en: require("../locale/en/messages"),
    vi: require("../locale/vi/messages"),
  },
});

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

    if (connection && connection.context["Accept-Language"]) {
      languageCode = pick(["en", "vi"], connection.context["Accept-Language"]);
    } else if (request && request.language) {
      languageCode = request.language;
    }

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
    maxFileSize: 2097152, // 2MB
    maxFiles: 5, // at the same time
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
