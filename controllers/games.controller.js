const { selectCategories,
        selectReview,
        updateReview } = require('../models/games.model.js')
const { checkInteger } = require('../utils/checkInteger.js')

const { checkReviewExists } = require('../utils/checkReviewExists.js') 

exports.getCategories = (req, res) => {

    return selectCategories()
        .then(( categories ) => {

            res.status(200).send({ categories })

        })
    
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

                return Promise.reject({ status: 400, message: 'Bad request'})

            }

            return updateReview(review_id, inc_votes)

        })
        .then((review) => {

            res.status(200).send({ review })

        })
        .catch(next)

}