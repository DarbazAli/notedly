'use strict'

import express from 'express'
import morgan from 'morgan'
import { ApolloServer, gql } from 'apollo-server-express'

import connection from './db/connectDB.js'
import Note from './models/noteModel.js'

const notes = [
  {
    id: 1,
    content: 'This is a note',
    author: 'Adam Scott',
  },
  {
    id: 2,
    content: 'This is another note',
    author: 'Harlow Everly',
  },
  {
    id: 3,
    content: 'Oh hey look, another note',
    author: 'Riley Harrison',
  },
]

// env variables
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 5000

const app = express()

connection.connect()

// app settings
if (env === 'development' || env === 'dev') {
  console.clear()
  app.use(morgan('dev'))
}

/* ====================== API ========================== */

// GraphQL Schema
const typeDefs = gql`
  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
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
const resolvers = {
  Query: {
    hello: () => 'Hello world',
    notes: async () => await Note.find({}),
    note: (parent, { id }) => notes.find((note) => note.id == id),
  },

  Mutation: {
    newNote: (parent, { content, author }) => {
      const note = {
        id: notes.length + 1,
        content,
        author,
      }
      notes.push(note)
      return note
    },
    deleteNote: (parent, { id }) => {
      notes.filter((note) => note.id != id)
      return 'Note deleted'
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app, path: '/api' })

app.get('/', (req, res) => {
  res.send('API is workding')
})

app.listen(port, () => {
  console.log(
    `GraphQL server is listening on http://localhost:${port}${server.graphqlPath}`
  )
})
