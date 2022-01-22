const { selectReview,
        updateReviewVotes,
        selectReviews,
        insertReview,
        deleteReviewFrom,
        updateReviewBody } = require('../models/reviews.model.js')

const { checkReviewExists,
        checkUserExists,
        checkCategoryExists } = require('../utils/checkExists.js')

exports.getReview = (req, res, next) => {

    const { review_id } = req.params

    if (!Number.isInteger(parseFloat(review_id))) {

        next({ status: 400, message: 'Bad request' })

    } else { 

        return checkReviewExists(review_id)
            .then((doesReviewExist) => {

                if (!doesReviewExist) {

                    return Promise.reject({ status: 404, message: 'Review does not exist' })
                    
                }

                return selectReview(review_id)

            })
            .then((review) => {

                review.comment_count = parseInt(review.comment_count)

                res.status(200).send( { review } )

            })
            .catch(next)

    }

}

exports.patchReviewVotes = (req, res, next) => {

    const { review_id } = req.params
    const { inc_votes } = req.body

    if (!Number.isInteger(inc_votes) || !Number.isInteger(parseFloat(review_id))) {

        next({ status: 400, message: 'Bad request' })

    } else {

        return checkReviewExists(review_id)
            .then((doesReviewExist) => {

                if (!doesReviewExist) {

                    return Promise.reject({ status: 404, message: "Review does not exist" })

                }

                return updateReviewVotes(review_id, inc_votes)

            })
            .then((review) => {

                res.status(200).send({ review })

            })
            .catch(next)

    }

}

exports.getReviews = (req, res, next) => {

    const validSortQueries = ['review_id', 'title', 'designer', 'owner', 'review_body', 'category', 'created_at', 'votes', undefined]
    const validOrderQueries = ['asc', 'desc', undefined]

    const sortQuery = req.query.sort_by

    const orderQuery = req.query.order

    let categoryQuery = req.query.category

    let limitQuery = req.query.limit

    let pageQuery = req.query.p

    if (categoryQuery !== undefined) {

        categoryQuery = categoryQuery.replace(/_/g, ' ')

    }

    if (limitQuery !== undefined) {

        limitQuery = parseFloat(limitQuery)

    }

    if (pageQuery !== undefined) {

        pageQuery = parseFloat(pageQuery)

    }

    if (!validSortQueries.includes(sortQuery) || !validOrderQueries.includes(orderQuery)) {

        next({ status: 400, message: 'Bad request' })

    } else if (pageQuery !== undefined && limitQuery === undefined) {

        next({ status: 400, message: 'Page query cannot be provided without limit query' })

    } else if ((limitQuery !== undefined && !Number.isInteger(limitQuery)) || (pageQuery !== undefined && !Number.isInteger(pageQuery))) {

        next({ status: 400, message: 'Bad request' })

    } else {

        return checkCategoryExists(categoryQuery)
            .then((doesCategoryExist) => {

                if (categoryQuery === undefined) {

                    doesCategoryExist = true

                }

                if (!doesCategoryExist) {

                    return Promise.reject({ status: 422, message: 'Category does not exist' })

                }

                return selectReviews(sortQuery, orderQuery, categoryQuery, pageQuery, limitQuery)

            })
            .then((reviews) => {

                reviews.forEach((review) => {

                    review.comment_count = parseInt(review.comment_count)

                })

                res.status(200).send({reviews})

            })
            .catch(next)

    }

}

exports.postReview = (req, res, next) => {

    const { title, owner, review_body, designer, category } = req.body

    if (title === undefined || owner === undefined || review_body === undefined || designer === undefined || category === undefined || title === '' || review_body === '' || designer === '' ) {
        
        next({ status: 400, message: 'Bad request' })

    } else if (title.length > 200) {

        next({ status: 400, message: 'Title too long' })

    } else if (review_body.length > 2000) {

        next({ status: 400, message: 'Review body too long' })

    } else if (designer.length > 50) {

        next({ status: 400, message: 'Designer name too long' })

    } else {

        return checkUserExists(owner)
        .then((doesUserExist) => {

            if (!doesUserExist) {

                return Promise.reject({ status: 422, message: 'User does not exist' })

            }

            return checkCategoryExists(category)

        })
        .then((doesCategoryExist) => {

            if (!doesCategoryExist) {

                return Promise.reject({ status: 422, message: 'Category does not exist' })

            }

            return insertReview(title, owner, review_body, designer, category)

        })
        .then((review) => {

            res.status(201).send({ review })

        })
        .catch(next)

    }

}

exports.deleteReview = (req, res, next) => {

    const { review_id } = req.params

    if (!Number.isInteger(parseFloat(review_id))) {

        next({ status: 400, message: 'Bad request' })

    } else {

        return checkReviewExists(review_id)
            .then((doesReviewExist) => {

                if (!doesReviewExist) {

                    return Promise.reject({ status: 404, message: 'Review does not exist' })

                }

                return deleteReviewFrom(review_id)

            })
            .then(() => {

                res.status(204).send({})

            })
            .catch(next)

    }

}

exports.patchReviewBody = (req, res, next) => {

    const { review_id } = req.params
    const { review_body } = req.body

    if (review_body === undefined || review_body === '' || !Number.isInteger(parseFloat(review_id))) {

        next({ status: 400, message: 'Bad request' })

    } else if (review_body.length > 2000) {

        next({ status: 400, message: 'Review body too long' })

    } else {

        return checkReviewExists(review_id)
            .then((doesReviewExist) => {

                if (!doesReviewExist) {

                    return Promise.reject({ status: 404, message: "Review does not exist" })

                }

                return updateReviewBody(review_id, review_body)

            })
            .then((review) => {

                res.status(200).send({ review })

            })
            .catch(next)

    }

}