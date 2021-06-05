export default {
  newNote: async (parent, args, { models }) => {
    const note = {
      content: args.content,
      author: args.author,
    }
    return await models.Note.create(note)
  },
  deleteNote: async (parent, args, { models }) => {
    await models.Note.findOneAndRemove({ _id: args.id })
    return 'Note deleted'
  },
}
