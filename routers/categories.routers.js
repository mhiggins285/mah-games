const express = require('express')
        
const { getCategories,
        postCategory } = require('../controllers/categories.controller.js')

const categoryRouter = express.Router()

categoryRouter.route('/')
            .get(getCategories)
            .post(postCategory)

module.exports = categoryRouter