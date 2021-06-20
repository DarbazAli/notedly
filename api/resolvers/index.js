import Query from './query.js'
import Mutation from './mutation.js'
import gqlISODate from 'graphql-iso-date'
const { GraphQLDateTime } = gqlISODate

import Note from './note.js'
import User from './user.js'

export default { Query, Mutation, Note, User, DateTime: GraphQLDateTime }
