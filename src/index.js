'use strict'

import express from 'express'
import morgan from 'morgan'
import { ApolloServer, gql } from 'apollo-server-express'

import connection from './db/connectDB.js'
import models from './models/index.js'

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
const resolvers = {
  Query: {
    notes: async () => await models.Note.find({}),
    note: async (parent, { id }) => await models.Note.findById({ _id: id }),
  },

  Mutation: {
    newNote: async (parent, { content, author }) => {
      const note = {
        content,
        author,
      }
      return await models.Note.create(note)
    },
    deleteNote: async (parent, { id }) => {
      await models.Note.findOneAndRemove({ _id: id })
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
