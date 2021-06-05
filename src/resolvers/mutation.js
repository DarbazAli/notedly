import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import dotenv from 'dotenv'
import gravatar from '../lib/gravatar.js'

dotenv.config()

export default {
  newNote: async (parent, args, { models }) => {
    const note = {
      content: args.content,
      author: args.author,
    }
    return await models.Note.create(note)
  },

  deleteNote: async (parent, { id }, { models }) => {
    try {
      const deletedNote = await models.Note.findOneAndRemove({ _id: id })
      if (deletedNote) return true
      else return false
    } catch (err) {
      return false
    }
  },

  updateNote: async (parent, { id, content }, { models }) => {
    try {
      return await models.Note.findOneAndUpdate(
        { _id: id },
        {
          $set: { content },
        },
        { new: true }
      )
    } catch (err) {
      return 'Note not found'
    }
  },

  // user auth
  signUp: async (parent, { username, email, password }, { models }) => {
    // normalize email address
    email = email.trim().toLowerCase()

    // hash the password
    const hashed = await bcrypt.hash(password, 10)

    // create the gravatar url
    const avatar = gravatar(email)

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      })

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    } catch (err) {
      console.log(err)
      throw new Error('Error creating account')
    }
  },

  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase()
    }

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    })
    if (!user) throw new AuthenticationError('Error signing in')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new AuthenticationError('Error signing in')

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  },
}
