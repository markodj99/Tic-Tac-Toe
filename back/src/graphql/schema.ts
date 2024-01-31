import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    getUsers: [User]!
    getUser(id: ID!): User
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, repeatpassword: String!): RegistrationResult
  }

  type RegistrationResult {
    success: Boolean!
    message: String!
  }
`;

export { typeDefs };
