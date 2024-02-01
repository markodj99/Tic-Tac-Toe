import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID
    username: String
    email: String
    password: String
    SinglePlayerGames: [SinglePlayerTTT]
    MultiPlayerCreatedGames: [MultiPlayerTTT]
    MultiPlayerJoinedGames: [MultiPlayerTTT]
  }

  type SinglePlayerTTT {
    id: Int
    playerId: Int
    moves: [String]
    computerSymbol: String
    winner: String
    boardState: [String]
    Player: User
  }

  type MultiPlayerTTT {
    id: Int
    creatorId: Int
    joinerId: Int
    creatorSymbol: String
    joinerSymbol: String
    turnToMove: String
    moves: [String]
    winner: String
    boardState: [String]
    Creator: User
    Joiner: User
  }

  type Query {
    getUsers: [User]!
    getUser(id: ID!): User
    getOrCreateSinglePlayer(userId: ID): SinglePlayerTTT!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, repeatpassword: String!): RegistrationResult
    loginUser(email: String!, password: String!): LoginResult
    setSymbol(userId: ID!, computerSymbol: String!): Boolean
    makeMove(userId: ID!, updatedBoardState: [String!]!, updatedMoves: [String!]!) : SPGameResponse
  }

  type SPGameResponse {
    moves: [String!]!,
    computerSymbol: String!,
    boardState: [String!]!,
    winner: String!
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
