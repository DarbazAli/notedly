'use strict'
if (process.env.NODE_ENV === 'development') console.clear()

import express from 'express'
import morgan from 'morgan'
const app = express()
const port = process.env.PORT || 5000

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Hello, World')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
