// @flow
import { gql } from 'apollo-server-express';

export const addressSchema = gql`
  enum Region {
    VI # Vietnam
    ZH # China
    JA # Japan
    KO # Korea
  }

  type Address {
    id: ID!

    # Address description: Home, Office, Mom, Dad, Headquarter, Branch, etc.
    description: String

    # vi: Vietnam, zh: China, ja: Japan, ko: Korea (enum will be defined in graphql-yoga)
    region: Region

    # For US address now, more research on other country address
    name: String!
    phone: String!
    street: String!
    unit: String
    district: String
    city: String!
    state: String!
    zip: String
  }

  input UpsertAddressInput {
    id: String!

    description: String
    region: Region
    name: String
    phone: String
    street: String
    unit: String
    city: String
    state: String
    zip: String
  }
`;
