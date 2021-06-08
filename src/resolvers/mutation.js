import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import dotenv from 'dotenv'
import gravatar from '../lib/gravatar.js'

dotenv.config()

export default {
  newNote: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note')
    }
    const note = {
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    }
    return await models.Note.create(note)
  },

  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a note')
    }
    // find the note
    const note = await models.Note.findById(id)
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError(
        "You don't have persmissions to delete the note!"
      )
    }
    try {
      await note.remove()
      return true
    } catch (err) {
      return false
    }
  },

  updateNote: async (parent, { id, content }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to update a note!')
    }

    const note = await models.Note.findById(id)
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to update the note!")
    }

    // if everything is good, update the note, and return the updated note
    return await models.Note.findOneAndUpdate(
      { _id: id },
      {
        $set: { content },
      },
      { new: true }
    )
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
