const { selectCategories,
        selectReview,
        updateReview,
        selectReviews,
        selectCommentsByReviewId,
        insertComment } = require('../models/games.model.js')

const { checkInteger } = require('../utils/checkInteger.js')

const { checkReviewExists } = require('../utils/checkReviewExists.js') 

const { checkUserExists } = require('../utils/checkUserExists.js')

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
        
        res.status(400).send({ message: 'Bad request' })

    }

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