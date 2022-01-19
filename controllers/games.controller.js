const { selectCategories,
        selectReview,
        updateReview,
        selectReviews,
        selectCommentsByReviewId,
        insertComment,
        deleteCommentFrom,
        selectUsers,
        selectUserByUsername,
        updateComment } = require('../models/games.model.js')

const { checkInteger } = require('../utils/checkInteger.js')

const { checkReviewExists } = require('../utils/checkReviewExists.js') 

const { checkUserExists } = require('../utils/checkUserExists.js')

const { checkCommentExists } = require('../utils/checkCommentExists.js')

const fs = require('fs/promises')

exports.getCategories = (req, res, next) => {

    return selectCategories()
        .then(( categories ) => {

            res.status(200).send({ categories })

        })
        .catch(next)
    
}

exports.getReview = (req, res, next) => {

    const { review_id } = req.params

    return checkReviewExists(review_id)
        .then((doesReviewExist) => {

            if (!doesReviewExist) {

                return Promise.reject({ status: 404, message: 'Review does not exist' })
                
            }

            return selectReview(review_id)

        })
        .then(([ review, comment_count ]) => {

            review.comment_count = parseInt(comment_count)

            res.status(200).send( { review } )

        })
        .catch(next)


}

exports.patchReview = (req, res, next) => {

    const { review_id } = req.params
    const { inc_votes } = req.body

    return checkReviewExists(review_id)
        .then((doesReviewExist) => {

            if (!doesReviewExist) {

                return Promise.reject({ status: 404, message: "Review does not exist" })

            }

            return checkInteger(inc_votes)

        })
        .then((isIncVotesInteger) => {

            if (!isIncVotesInteger) {

                return Promise.reject({ status: 400, message: 'Bad request' })

            }

            return updateReview(review_id, inc_votes)

        })
        .then((review) => {

            res.status(200).send({ review })

        })
        .catch(next)

}

exports.getReviews = (req, res, next) => {

    const sortQuery = req.query.sort_by

    const orderQuery = req.query.order

    const categoryQuery = req.query.category

    return selectReviews(sortQuery, orderQuery, categoryQuery)
        .then((reviews) => {

            reviews.forEach((review) => {

                review.comment_count = parseInt(review.comment_count)

            })

            res.status(200).send({reviews})

        })
        .catch(next)

}

exports.getCommentsByReviewId = (req, res, next) => {

    const { review_id } = req.params

    return checkReviewExists(review_id)
        .then((doesReviewExist) => {

            if (!doesReviewExist) {

                return Promise.reject({ status: 404, message: 'Review does not exist' })

            }

            return selectCommentsByReviewId(review_id)

        })
        .then((comments) => {

            res.status(200).send({ comments })

        })
        .catch(next)

}

exports.postCommentToReview = (req, res, next) => {

    const { review_id } = req.params
    const { user, body } = req.body

    if (body === undefined || user === undefined || body === '' || body.length > 1000) {
        
        next({ status: 400, message: 'Bad request' })

    } else {

        return checkReviewExists(review_id)
        .then((doesReviewExist) => {

            if (!doesReviewExist) {

                return Promise.reject({ status: 404, message: 'Review does not exist' })

            }

            return checkUserExists(user)

        })
        .then((doesUserExist) => {

            if (!doesUserExist) {

                return Promise.reject({ status: 404, message: 'User does not exist' })

            }

            return insertComment(review_id, user, body)

        })
        .then((comment) => {

            res.status(201).send({ comment })

        })
        .catch(next)

    }

    

}

exports.deleteComment = (req, res, next) => {

    const { comment_id } = req.params

    return checkCommentExists(comment_id)
        .then((doesCommentExist) => {

            if (!doesCommentExist) {

                return Promise.reject({ status: 404, message: 'Comment does not exist' })

            }

            return deleteCommentFrom(comment_id)

        })
        .then(() => {

            res.status(204).send({})

        })
        .catch(next)

}

exports.getEndpoints = (req, res, next) => {

    return fs.readFile('endpoints.json', 'utf-8')
        .then((endpoints) => {

            res.status(200).send(endpoints)

        })

}

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

exports.patchComment = (req, res, next) => {

    const { comment_id } = req.params
    const { inc_votes } = req.body

    return checkCommentExists(comment_id)
        .then((doesCommentExist) => {

            if (!doesCommentExist) {

                return Promise.reject({ status: 404, message: "Comment does not exist" })

            }

            return checkInteger(inc_votes)

        })
        .then((isIncVotesInteger) => {

            if (!isIncVotesInteger) {

                return Promise.reject({ status: 400, message: 'Bad request' })

            }

            return updateComment(comment_id, inc_votes)

        })
        .then((comment) => {

            res.status(200).send({ comment })

        })
        .catch(next)

}