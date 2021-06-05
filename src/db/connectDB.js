import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notedly'

const connect = () =>
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('MongoDB connected successfully')
    })
    .catch((err) => {
      console.log(err)
    })

const close = () => mongoose.connection.close()

export default { connect, close }
