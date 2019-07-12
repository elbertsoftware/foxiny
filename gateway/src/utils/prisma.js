// @flow

import { Prisma } from "prisma-binding";

import { fragmentReplacements } from "../resolvers";

const prisma = new Prisma({
  typeDefs: "./src/type-defs/generated/prisma.graphql", // link to generated prisma schema
  endpoint: process.env.PRISMA_ENDPOINT, // point to prisma server running in docker compose
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements, // send fragment definition to prisma server
});

export default prisma;
