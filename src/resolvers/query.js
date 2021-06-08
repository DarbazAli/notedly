export default {
  // bring up all notes
  notes: async (parent, args, { models }) => await models.Note.find({}),

  // get a single note by ID
  note: async (parent, args, { models }) =>
    await models.Note.findById({ _id: args.id }),

  // Get a singel user by ID
  user: async (parent, { username }, { models }) =>
    await models.User.findOne({ username }),

  // Get all users
  users: async (parent, args, { models }) => await models.User.find({}),

  // Get current loged in user
  me: async (parent, args, { models, user }) =>
    await models.User.findById(user.id),
}
