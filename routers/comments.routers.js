const express = require('express')
    
const { deleteComment,
        patchComment } = require('../controllers/comments.controller.js')

const commentRouter = express.Router()

commentRouter.route('/:comment_id')
            .delete(deleteComment)
            .patch(patchComment)

module.exports = commentRouter