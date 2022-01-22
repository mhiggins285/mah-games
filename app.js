const express = require("express")

const { checksMethodNotAllowed,
    handlesInvalidEndpoint, 
    handlesCustomErrors, 
    handlesUnspecifiedErrors } = require('./controllers/errors.controller.js')
    
const apiRouter = require("./routers/api.routers.js")

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.use(checksMethodNotAllowed)

app.all('*', handlesInvalidEndpoint)

app.use(handlesCustomErrors)

app.use(handlesUnspecifiedErrors)

module.exports = app