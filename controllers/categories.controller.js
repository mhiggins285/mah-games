const { selectCategories,
        insertCategory } = require('../models/categories.model.js')

const { checkCategoryExists } = require('../utils/checkExists.js')

exports.getCategories = (req, res, next) => {

    return selectCategories()
        .then(( categories ) => {

            res.status(200).send({ categories })

        })
        .catch(next)
    
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
