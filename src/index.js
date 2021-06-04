'use strict'

import express from 'express'
import morgan from 'morgan'
import { ApolloServer, gql } from 'apollo-server-express'

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
    note(id: ID, author: String): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Mutation {
    newNote(content: String!, author: String!): Note!
  }
`

const resolvers = {
  // retrive data
  Query: {
    hello: () => 'Hello World',
    notes: () => notes,
    note: (parent, { id, author }) =>
      notes.find((note) => note.id == id || note.author == author),
  },

  // mutate/modify data
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
