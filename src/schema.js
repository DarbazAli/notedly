import { gql } from 'apollo-server-express'

export default gql`
  scalar DateTime
  type Query {
    notes: [Note!]!
    note(id: ID!): Note
    noteFeed(cursor: String): NoteFeed
    user(username: String!): User
    users: [User!]!
    me: User!
  }

  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note
    deleteNote(id: ID!): Boolean!

    toggleFavorite(id: ID!): Note!

    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String, password: String!): String!
  }
`
