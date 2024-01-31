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
    loginUser(email: String!, password: String!): LoginResult
  }

  type RegistrationResult {
    success: Boolean!
    message: String!
  }

  type LoginResult {
    success: Boolean!
    message: String!
  }
`;

export { typeDefs };
