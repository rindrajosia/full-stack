const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()


mongoose
  .connect(config.MONGODB_URI)
  .then(result => { // eslint-disable-line no-unused-vars
    logger.info('Connected to mongodb')
  })
  .catch(error => {
    logger.error(error.message)
  })




app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)




module.exports = app
