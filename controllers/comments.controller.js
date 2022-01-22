const { selectCommentsByReviewId,
        insertComment,
        deleteCommentFrom,
        updateCommentVotes,
        updateCommentBody } = require('../models/comments.model.js')

const { checkReviewExists,
        checkUserExists,
        checkCommentExists } = require('../utils/checkExists.js')

exports.getCommentsByReviewId = (req, res, next) => {

    const { review_id } = req.params

    let limitQuery = req.query.limit

    let pageQuery = req.query.p

    if (limitQuery !== undefined) {

        limitQuery = parseFloat(limitQuery)

    }

    if (pageQuery !== undefined) {

        pageQuery = parseFloat(pageQuery)

    }

    if (pageQuery !== undefined && limitQuery === undefined) {

        next({ status: 400, message: 'Page query cannot be provided without limit query' })

    } else if ((limitQuery !== undefined && !Number.isInteger(limitQuery)) || (pageQuery !== undefined && !Number.isInteger(pageQuery)) || !Number.isInteger(parseFloat(review_id))) {

        next({ status: 400, message: 'Bad request' })

    } else {

        return checkReviewExists(review_id)
            .then((doesReviewExist) => {

                if (!doesReviewExist) {

                    return Promise.reject({ status: 404, message: 'Review does not exist' })

                }

                return selectCommentsByReviewId(review_id, limitQuery, pageQuery)

            })
            .then((comments) => {

                res.status(200).send({ comments })

            })
            .catch(next)

    }

}

exports.postCommentToReview = (req, res, next) => {

    const { review_id } = req.params
    const { user, body } = req.body

    if (body === undefined || user === undefined || body === '' || !Number.isInteger(parseFloat(review_id))) {
        
        next({ status: 400, message: 'Bad request' })

    } else if (body.length > 1000) {

        next({ status: 400, message: 'Comment body too long' })

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

                return Promise.reject({ status: 422, message: 'User does not exist' })

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

    if (!Number.isInteger(parseFloat(comment_id))) {

        next({ status: 400, message: 'Bad request'})

    } else {

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

}

exports.patchCommentVotes = (req, res, next) => {

    const { comment_id } = req.params
    const { inc_votes } = req.body

    if (!Number.isInteger(inc_votes) || !Number.isInteger(parseFloat(comment_id))) {
        
        next({ status: 400, message: 'Bad request' })

    } else {

        return checkCommentExists(comment_id)
            .then((doesCommentExist) => {

                if (!doesCommentExist) {

                    return Promise.reject({ status: 404, message: "Comment does not exist" })

                }

                return updateCommentVotes(comment_id, inc_votes)

            })
            .then((comment) => {

                res.status(200).send({ comment })

            })
            .catch(next)

    }

}

exports.patchCommentBody = (req, res, next) => {

    const { comment_id } = req.params
    const { body } = req.body

    if (body === undefined || body === '' || !Number.isInteger(parseFloat(comment_id))) {
        
        next({ status: 400, message: 'Bad request' })

    } else if (body.length > 1000) {

        next({ status: 400, message: 'Comment body too long' })

    } else {

        return checkCommentExists(comment_id)
            .then((doesCommentExist) => {

                if (!doesCommentExist) {

                    return Promise.reject({ status: 404, message: "Comment does not exist" })

                }

                return updateCommentBody(comment_id, body)

            })
            .then((comment) => {

                res.status(200).send({ comment })

            })
            .catch(next)

    }

}