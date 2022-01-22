const express = require('express')

const { getUsers,
        getUserByUsername,
        postUser,
        patchUser } = require('../controllers/users.controller.js')

const userRouter = express.Router()

userRouter.route('/')
        .get(getUsers)
        .post(postUser)

userRouter.route('/:username') 
        .get(getUserByUsername)
        .patch(patchUser)

module.exports = userRouter