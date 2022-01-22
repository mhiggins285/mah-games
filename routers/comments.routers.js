const express = require('express')
    
const { deleteComment,
        patchCommentVotes,
        patchCommentBody } = require('../controllers/comments.controller.js')

const commentRouter = express.Router()

commentRouter.delete('/:comment_id', deleteComment)
            
commentRouter.patch('/:comment_id/votes', patchCommentVotes)
            
commentRouter.patch('/:comment_id/body', patchCommentBody)

module.exports = commentRouter