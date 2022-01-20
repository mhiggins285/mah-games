const { selectCategories,
        selectReview,
        updateReview,
        selectReviews,
        selectCommentsByReviewId,
        insertComment,
        deleteCommentFrom,
        selectUsers,
        selectUserByUsername,
        updateComment,
        insertCategory,
        insertReview,
        deleteReviewFrom } = require('../models/games.model.js')

const { checkReviewExists } = require('../utils/checkReviewExists.js') 

const { checkUserExists } = require('../utils/checkUserExists.js')

const { checkCommentExists } = require('../utils/checkCommentExists.js')

const { checkCategoryExists } = require('../utils/checkCategoryExists.js')

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

    if (!Number.isInteger(inc_votes)) {

        next({ status: 400, message: 'Bad request' })

    } else {

        return checkReviewExists(review_id)
            .then((doesReviewExist) => {

                if (!doesReviewExist) {

                    return Promise.reject({ status: 404, message: "Review does not exist" })

                }

                return updateReview(review_id, inc_votes)

            })
            .then((review) => {

                res.status(200).send({ review })

            })
            .catch(next)

    }

}

exports.getReviews = (req, res, next) => {

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

    if (pageQuery !== undefined && limitQuery === undefined) {

        next({ status: 400, message: 'Page query cannot be provided without limit query' })

    } else if ((limitQuery !== undefined && !Number.isInteger(limitQuery)) || (pageQuery !== undefined && !Number.isInteger(pageQuery))) {

        next({ status: 400, message: 'Bad request' })

    } else {

        return selectReviews(sortQuery, orderQuery, categoryQuery, pageQuery, limitQuery)
            .then((reviews) => {

                reviews.forEach((review) => {

                    review.comment_count = parseInt(review.comment_count)

                })

                res.status(200).send({reviews})

            })
            .catch(next)

    }

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

    if (body === undefined || user === undefined || body === '') {
        
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

    if (!Number.isInteger(inc_votes)) {
        
        next({ status: 400, message: 'Bad request' })

    } else {

        return checkCommentExists(comment_id)
            .then((doesCommentExist) => {

                if (!doesCommentExist) {

                    return Promise.reject({ status: 404, message: "Comment does not exist" })

                }

                return updateComment(comment_id, inc_votes)

            })
            .then((comment) => {

                res.status(200).send({ comment })

            })
            .catch(next)

    }

}

exports.postCategory = (req, res, next) => {

    const { slug, description } = req.body

    if (slug === undefined || description === undefined || slug === '' || description === '') {
        
        next({ status: 400, message: 'Bad request' })

    } else if (description.length > 1000) {

        next({ status: 400, message: 'Description too long' })

    } else if (slug.length > 50) {

        next({ status: 400, message: 'Category name too long' })

    } else {

        return checkCategoryExists(slug)
        .then((doesCategoryExist) => {

            if (doesCategoryExist) {

                return Promise.reject({ status: 422, message: 'Category already exists' })

            }

            return insertCategory(slug, description)

        })
        .then((category) => {

            res.status(201).send({ category })

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