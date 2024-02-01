import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type UserModel {
    id: ID
    username: String
    email: String
    password: String
    SinglePlayerGames: [SinglePlayer]
    MultiPlayerCreatedGames: [MultiPlayer]
    MultiPlayerJoinedGames: [MultiPlayer]
  }

  type SinglePlayer {
    index: Int
    id: ID
    playerId: Int
    moves: [String]
    computerSymbol: String
    yourSymbol: String
    winner: String
    boardState: [String]
    Player: UserModel
    updatedAt: String
  }

  type MultiPlayer {
    index: Int
    id: ID
    creatorId: Int
    joinerId: Int
    creatorSymbol: String
    joinerSymbol: String
    yourSymbol: String
    opponentSymbol: String
    turnToMove: String
    moves: [String]
    winner: Int
    winnerString: String
    boardState: [String]
    Creator: UserModel
    Joiner: UserModel
    updatedAt: String
  }

  type Query {
    getUser(userId: ID!): UserModel!
    getOrCreateSinglePlayer(userId: ID!): SinglePlayer!
    hasGame(userId: ID!): HasGameResponse!
    getExistingGames: [GameListData!]!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, repeatpassword: String!): RegistrationResult!
    loginUser(email: String!, password: String!): LoginResult!
    setSymbol(userId: ID!, computerSymbol: String!): Boolean!
    makeMove(userId: ID!, updatedBoardState: [String!]!, updatedMoves: [String!]!) : SPGameResponse!
    createNewGame(userId: ID!, creatorSymbol: String!): HasGameResponse!
    joinGame(userId: ID!, gameId: ID!): JoinGameResponse!
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

  type HasGameResponse {
    condition: Boolean!
    gameId: Int!
  }

  type GameListData {
    index: Int!
    gameId: Int!
    creatorName: String!
    creatorSymbol: String!
    yourSymbol: String!
  }

  type JoinGameResponse {
    condition: Boolean!
    gameId: Int!
  }
`;

export { typeDefs };
