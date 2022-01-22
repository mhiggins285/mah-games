const { selectUsers,
        selectUserByUsername } = require('../models/users.model.js')

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