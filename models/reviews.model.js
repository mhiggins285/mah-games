const db = require('../db/connection.js')

exports.selectReview = async (review_id) => {

    const query = `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.review_img_url, reviews.owner, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews
                    LEFT JOIN comments
                    ON reviews.review_id = comments.review_id
                    WHERE reviews.review_id = $1
                    GROUP BY reviews.review_id;`

    const response = await db.query(query, [review_id])
    
    return response.rows[0]

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

exports.selectReviews = async (sortQuery, orderQuery, categoryQuery, pageQuery, limitQuery) => {

    if (sortQuery === undefined && orderQuery === undefined) {

        sortQuery = 'created_at'
        orderQuery = 'desc'

    } else if (sortQuery === undefined) {

        sortQuery = 'created_at'

    } else if (orderQuery === undefined) {

        orderQuery = 'asc'

    }

    let conditionalLine = ''

    if (categoryQuery) {

        conditionalLine = `WHERE reviews.category = '${categoryQuery}'`

    }

    let limitLine = ''

    if (limitQuery) {

        if (!pageQuery) {

            pageQuery = 1

        }

        const offset = limitQuery * (pageQuery - 1)

        limitLine = `LIMIT ${limitQuery} OFFSET ${offset}`

    }

    const query = `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.review_img_url, reviews.owner, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews
                    LEFT JOIN comments
                    ON reviews.review_id = comments.review_id
                    ${conditionalLine}
                    GROUP BY reviews.review_id
                    ORDER BY ${sortQuery} ${orderQuery}
                    ${limitLine};`

    const response = await db.query(query)

    return response.rows

}

exports.insertReview = async (title, owner, review_body, designer, category) => {

    const query = `INSERT INTO reviews
                    (title, owner, review_body, designer, category)
                    VALUES
                    ($1, $2, $3, $4, $5)
                    RETURNING *;`
    const queryParams = [title, owner, review_body, designer, category]

    const response = await db.query(query, queryParams)

    const review = response.rows[0]

    review.comment_count = 0

    return review

}

exports.deleteReviewFrom = async (review_id) => {

    const commentQuery = `DELETE FROM comments
                        WHERE review_id = $1;`

    await db.query(commentQuery, [review_id])

    const reviewQuery = `DELETE FROM reviews
                        WHERE review_id = $1;`

    await db.query(reviewQuery, [review_id])

}