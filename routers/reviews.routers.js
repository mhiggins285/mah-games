const express = require('express')

const { getReview,
        patchReviewVotes,
        getReviews,
        postReview,
        deleteReview,
        patchReviewBody } = require('../controllers/reviews.controller.js')
    
const { getCommentsByReviewId,
        postCommentToReview } = require('../controllers/comments.controller.js')


const reviewRouter = express.Router()

reviewRouter.route('/')
            .get(getReviews)
            .post(postReview)

reviewRouter.route('/:review_id')
            .get(getReview)
            .delete(deleteReview)

reviewRouter.patch('/:review_id/votes', patchReviewVotes)

reviewRouter.patch('/:review_id/body', patchReviewBody)

reviewRouter.route('/:review_id/comments')
            .get(getCommentsByReviewId)
            .post(postCommentToReview)

module.exports = reviewRouter