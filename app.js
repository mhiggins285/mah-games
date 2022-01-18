const express = require("express")
const { invalidEndpoint, 
        handlesCustomErrors, 
        handlesUnspecifiedErrors } = require('./controllers/errors.controller.js')
const { getCategories,
        getReview,
        patchReview,
        getReviews,
        getCommentsByReviewId,
        postCommentToReview } = require('./controllers/games.controller.js')

const app = express()

app.use(express.json())

// returns array of categories
app.get('/api/categories', getCategories)

// returns review by review_id
app.get('/api/reviews/:review_id', getReview)

// modifies the total votes on a review
app.patch('/api/reviews/:review_id', patchReview)

// returns list of all reviews
app.get('/api/reviews', getReviews)

// return list of all comments on a review
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

// posts comment to a review
app.post('/api/reviews/:review_id/comments', postCommentToReview)

app.all('*', invalidEndpoint)

app.use(handlesCustomErrors)

app.use(handlesUnspecifiedErrors)

module.exports = app