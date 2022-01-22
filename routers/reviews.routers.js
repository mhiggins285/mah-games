const express = require('express')

const { getReview,
        patchReview,
        getReviews,
        postReview,
        deleteReview } = require('../controllers/reviews.controller.js')
    
const { getCommentsByReviewId,
        postCommentToReview } = require('../controllers/comments.controller.js')


const reviewRouter = express.Router()

reviewRouter.route('/')
            .get(getReviews)
            .post(postReview)

reviewRouter.route('/:review_id')
            .get(getReview)
            .patch(patchReview)
            .delete(deleteReview)

reviewRouter.route('/:review_id/comments')
            .get(getCommentsByReviewId)
            .post(postCommentToReview)

module.exports = reviewRouter