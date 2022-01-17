const { selectCategories,
        selectReview } = require('../models/games.model.js')

exports.getCategories = (req, res) => {

    return selectCategories()
        .then(( categories ) => {

            res.status(200).send({ categories })

        })
    
}

exports.getReview = (req, res, next) => {

    const { review_id } = req.params

    return selectReview(review_id)
        .then(([ review, comment_count ]) => {

            review.comment_count = comment_count

            res.status(200).send( { review } )

        })
        .catch(next)

}