"use strict"
console.clear()

import express from "express"
import { ApolloServer, gql } from "apollo-server-express"

const app = express()

const port = process.env.PORT || 5000

// construct a scheam using GraphQl Schema Language
const typeDefs = gql`
    type Query {
        hello: String
    }
`

// Provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => "Hello World",
    },
}

// apollo server setup
const server = new ApolloServer({ typeDefs, resolvers })

// Apply the Apollo GraphQl middleware and set the path to /api
server.applyMiddleware({ app, path: "/api" })

app.listen(port, () => {
    console.log(
        `GraphQl Server running at http://localhost:${port}${server.graphqlPath}`
    )
})
