const { selectUsers,
        selectUserByUsername,
        insertUser,
        updateUser } = require('../models/users.model.js')

const { checkUserExists } = require('../utils/checkExists.js')

exports.getUsers = (req, res, next) => {

    return selectUsers()
        .then((users) => {

            res.status(200).send({ users })

        })
        .catch(next)

}

exports.getUserByUsername = (req, res, next) => {

    const { username } = req.params

    return checkUserExists(username)
        .then((doesUserExist) => {

            if (!doesUserExist) {

                return Promise.reject({ status: 404, message: 'User does not exist' })
                
            }

            return selectUserByUsername(username)

        })
        .then((user) => {

            res.status(200).send({ user })

        })
        .catch(next)

}


exports.postUser = (req, res, next) => {

    const { username, name, avatar_url } = req.body

    if (username === undefined || username === '') {
        
        next({ status: 400, message: 'Bad request' })

    } else if (username.length > 25) {

        next({ status: 400, message: 'Username too long' })

    } else if (name !== undefined && name.length > 50) {

        next({ status: 400, message: 'Name too long' })

    } else if (avatar_url !== undefined && avatar_url.length > 200) {

        next({ status: 400, message: 'Avatar URL too long' })

    } else {

        return checkUserExists(username)
        .then((doesUserExist) => {

            if (doesUserExist) {

                return Promise.reject({ status: 422, message: 'Username already taken' })

            }

            return insertUser(username, name, avatar_url)

        })
        .then((user) => {

            res.status(201).send({ user })

        })
        .catch(next)

    }

}

exports.patchUser = (req, res, next) => {

    const { username } = req.params
    const { name, avatar_url } = req.body

    if ( name === undefined && avatar_url === undefined ) {
        
        next({ status: 400, message: 'Bad request' })

    } else if (name !== undefined && name.length > 50) {

        next({ status: 400, message: 'Name too long' })

    } else if (avatar_url !== undefined && avatar_url.length > 200) {

        next({ status: 400, message: 'Avatar URL too long' })

    } else {

        return checkUserExists(username)
            .then((doesUserExist) => {

                if (!doesUserExist) {

                    return Promise.reject({ status: 404, message: "User does not exist" })

                }

                return updateUser(username, name, avatar_url)

            })
            .then((user) => {

                res.status(200).send({ user })

            })
            .catch(next)

    }

}