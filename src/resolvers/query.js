export default {
  notes: async (parent, args, { models }) => await models.Note.find({}),
  note: async (parent, args, { models }) =>
    await models.Note.findById({ _id: args.id }),
}
