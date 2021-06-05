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
}
