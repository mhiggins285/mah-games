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
    
    return [ reviewResponse.rows[0], commentCountResponse.rows[0].count ]

}

exports.updateReview = async ( review_id, inc_votes ) => {

    const readQuery = `SELECT * FROM reviews
                    WHERE review_id = $1;`
    const writeQuery = `UPDATE reviews
                    SET votes = $1
                    WHERE review_id = $2
                    RETURNING *;`

    const readResponse = await db.query(readQuery, [review_id])

    const oldVotes = readResponse.rows[0].votes
    const newVotes = oldVotes + inc_votes

    const writeResponse = await db.query(writeQuery, [newVotes, review_id])

    return writeResponse.rows[0]

}