'use strict'

import express from 'express'
import morgan from 'morgan'
import { ApolloServer } from 'apollo-server-express'

import connection from './db/connectDB.js'
import models from './models/index.js'

import typeDefs from './schema.js'
import resolvers from './resolvers/index.js'

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

/* ====================== APOLLO SERVER ========================== */

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models }
  },
})
server.applyMiddleware({ app, path: '/api' })

app.get('/', (req, res) => {
  res.send('API is workding')
})

app.listen(port, () => {
  console.log(
    `GraphQL server is listening on http://localhost:${port}${server.graphqlPath}`
  )
})
