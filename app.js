const express = require("express")
const { invalidEndpoint, 
        handlesCustomErrors, 
        handlesUnspecifiedErrors } = require('./controllers/errors.controller.js')
const { getCategories,
        getReview,
        patchReview } = require('./controllers/games.controller.js')

const app = express()

app.use(express.json())

// returns array of categories
app.get('/api/categories', getCategories)

// returns review by review_id
app.get('/api/reviews/:review_id', getReview)

// modifies the total votes on a review
app.patch('/api/reviews/:review_id', patchReview)

app.all("*", invalidEndpoint)

app.use(handlesCustomErrors)

app.use(handlesUnspecifiedErrors)

module.exports = app