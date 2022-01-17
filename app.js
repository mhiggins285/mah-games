const express = require("express")
const { invalidEndpoint } = require('./controllers/errors.controller.js')
const { getCategories,
        getReview } = require('./controllers/games.controller.js')

const app = express()

app.use(express.json())

// returns array of categories
app.get('/api/categories', getCategories)

// returns review by review_id
app.get('/api/reviews/:review_id', getReview)

app.all("*", invalidEndpoint)

app.use((err, req, res, next) => {

    if (err.status) {
      res.status(err.status).send({ message: err.message })
    } else {
      next(err)
    }
})

app.use((err, req, res, next) => {

    res.status(500).send({ message: "Something went wrong" })

})

module.exports = app