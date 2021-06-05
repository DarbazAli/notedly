import { gql } from 'apollo-server-express'

export default gql`
  scalar DateTime
  type Query {
    notes: [Note!]!
    note(id: ID!): Note
  }

  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Mutation {
    newNote(content: String!, author: String!): Note!
    updateNote(id: ID!, content: String!): Note
    deleteNote(id: ID!): Boolean!
  }
`
