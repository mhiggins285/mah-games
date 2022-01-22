const express = require('express')

const { getEndpoints } = require('../controllers/general.controller')

const categoryRouter = require('./categories.routers.js')
const userRouter = require('./users.routers.js')
const reviewRouter = require('./reviews.routers.js')
const commentRouter = require('./comments.routers.js')

const apiRouter = express.Router()

apiRouter.get('/', getEndpoints)

apiRouter.use('/categories', categoryRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/comments', commentRouter)

module.exports = apiRouter