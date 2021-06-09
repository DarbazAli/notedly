export default {
  // bring up all notes
  notes: async (parent, args, { models }) => await models.Note.find({}),

  // get a single note by ID
  note: async (parent, args, { models }) =>
    await models.Note.findById({ _id: args.id }),

  noteFeed: async (parent, { cursor }, { models }) => {
    const limit = 10

    // defalut hasNextValue
    let hasNextPage = false

    // if no cursor is passed, the default query will be empty
    let cursorQuery = {}

    // if there is a cursor, our query will look for notes with an
    // ObjectId less than that of the cursor
    if (cursor) cursorQuery = { _id: { $lt: cursor } }

    // find the limit + 1 in our db, sorted newest to oldest
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1)

    // if number of notes we find exceeds our limt
    // set hasNextPage to true, and trim the notes to the limit
    if (notes.length > limit) {
      hasNextPage = true
      notes = notes.slice(0, -1)
    }

    // the new cursor will be the Mongo Object ID of the last item in the feed array
    const newCursor = notes[notes.length - 1]._id

    return {
      notes,
      cursor: newCursor,
      hasNextPage,
    }
  },

  // Get a singel user by ID
  user: async (parent, { username }, { models }) =>
    await models.User.findOne({ username }),

  // Get all users
  users: async (parent, args, { models }) => await models.User.find({}),

  // Get current loged in user
  me: async (parent, args, { models, user }) =>
    await models.User.findById(user.id),
}
