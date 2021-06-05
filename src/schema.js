import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    notes: [Note!]!
    note(id: ID!): Note
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Mutation {
    newNote(content: String!, author: String!): Note!
    deleteNote(id: ID!): String
  }
`
