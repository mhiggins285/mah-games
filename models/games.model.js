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

exports.selectReviews = async () => {

    const query = `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.review_img_url, reviews.owner, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews
                        FULL JOIN comments
                        ON reviews.review_id = comments.review_id
                        GROUP BY reviews.review_id;`


    const response = await db.query(query)

    return response.rows

}