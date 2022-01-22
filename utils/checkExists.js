const db = require('../db/connection.js')

exports.checkUserExists = async (username) => {

    const query = `SELECT * FROM users
                    WHERE username = $1;`

    const response = await db.query(query, [username])

    return !(response.rows.length === 0)

}

exports.checkCategoryExists = async (category) => {

    const query = `SELECT * FROM categories
                    WHERE slug = $1;`

    const response = await db.query(query, [category])

    return !(response.rows.length === 0)

}

exports.checkReviewExists = async (review_id) => {

    const query = `SELECT * FROM reviews
                    WHERE review_id = $1;`

    const response = await db.query(query, [review_id])

    return !(response.rows.length === 0)

}

exports.checkCommentExists = async (comment_id) => {

    const query = `SELECT * FROM comments
                    WHERE comment_id = $1;`

    const response = await db.query(query, [comment_id])

    return !(response.rows.length === 0)

}