const db = require('../db/connection.js')

exports.selectCategories = async () => {

    const response = await db.query('SELECT * FROM categories;')

    return response.rows

}

exports.selectReview = async (review_id) => {

    const reviewQuery = `SELECT * FROM reviews 
                        WHERE review_id = $1;`
    const commentCountQuery = `SELECT COUNT(*) AS count FROM comments 
                        WHERE review_id = $1
                        GROUP BY review_id;`

    const reviewPromise = db.query(reviewQuery, [review_id])
    const commentCountPromise = db.query(commentCountQuery, [review_id])

    const [ reviewResponse, commentCountResponse ] = await Promise.all([ reviewPromise, commentCountPromise ])
    
    if ( reviewResponse.rows.length === 0 ) {

        return Promise.reject({ status: 404, message: "Review does not exist" })

    }

    return [ reviewResponse.rows[0], commentCountResponse.rows[0].count ]

}