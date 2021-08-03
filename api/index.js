'use strict'

import express from 'express'
import morgan from 'morgan'
import { ApolloServer } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from 'graphql-validation-complexity'
import cors from 'cors'
import helmet from 'helmet'

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

// app.use(helmet())
app.use(helmet({ contentSecurityPolicy: (env === 'production') ? undefined : false }));
app.use(cors())

/* ====================== APOLLO SERVER ========================== */

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Session invalid')
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization
    const user = getUser(token)
    console.log(user)
    return { models, user }
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
