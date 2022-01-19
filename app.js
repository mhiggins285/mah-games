const express = require("express")

const { invalidEndpoint, 
        handlesCustomErrors, 
        handlesUnspecifiedErrors } = require('./controllers/errors.controller.js')
        
const { getCategories,
        getReview,
        patchReview,
        getReviews,
        getCommentsByReviewId,
        postCommentToReview,
        deleteComment,
        getEndpoints,
        getUsers,
        getUserByUsername,
        patchComment } = require('./controllers/games.controller.js')

const app = express()

app.use(express.json())

// returns list of available endpoints
app.get('/api', getEndpoints)

// returns array of categories
app.get('/api/categories', getCategories)

// returns list of all users
app.get('/api/users', getUsers)

// returns user by username
app.get('/api/users/:username', getUserByUsername)

// returns list of all reviews
app.get('/api/reviews', getReviews)

// returns review by review_id
app.get('/api/reviews/:review_id', getReview)

// modifies the total votes on a review
app.patch('/api/reviews/:review_id', patchReview)

// return list of all comments on a review
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

// posts comment to a review
app.post('/api/reviews/:review_id/comments', postCommentToReview)

// modifies the total votes on a comment
app.patch('/api/comments/:comment_id', patchComment)

// deletes comment
app.delete('/api/comments/:comment_id', deleteComment)

app.all('*', invalidEndpoint)

app.use(handlesCustomErrors)

app.use(handlesUnspecifiedErrors)

module.exports = app