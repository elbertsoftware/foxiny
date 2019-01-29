import gql from 'graphql-tag';

export const resolvers = {
  Mutation: {
    updateUser: (_, { data: { name, email, phone, token } }, { cache }) => {
      const query = gql`
        query {
          currentUser @client {
            name
            email
            phone
            token
          }
        }
      `;
      const prevState = cache.readQuery({ query });

      const data = {
        ...prevState,
        currentUser: {
          ...prevState.currentUser,
          name,
          email,
          phone,
          token,
        },
      };

      cache.writeData({ query, data });
    },
  },
};

export const typeDefs = `
  type UserInfo {
    name: String!
    email: String
    phone: String
    token: String
  }
  type Mutation {
    updateUser(data: UserInfo!): UserInfo!
  }
`;
