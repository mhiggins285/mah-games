const db = require('../db/connection.js')

exports.selectCommentsByReviewId = async (review_id, limitQuery, pageQuery) => {

    let limitLine = ''

    if (limitQuery) {

        if (!pageQuery) {

            pageQuery = 1

        }

        const offset = limitQuery * (pageQuery - 1)

        limitLine = `LIMIT ${limitQuery} OFFSET ${offset}`

    }

    const query = `SELECT * FROM comments
                    WHERE review_id = $1
                    ${limitLine};`

    const response = await db.query(query, [review_id])

    return response.rows

}

exports.insertComment = async (review_id, user, body) => {

    const query = `INSERT INTO comments
                    (review_id, author, body)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *;`
    const queryParams = [review_id, user, body]

    const response = await db.query(query, queryParams)

    return response.rows[0]

}

exports.deleteCommentFrom = async (comment_id) => {

    const query = `DELETE FROM comments
                    WHERE comment_id = $1;`

    await db.query(query, [comment_id])

}

exports.updateCommentVotes = async ( comment_id, inc_votes ) => {

    const readQuery = `SELECT * FROM comments
                    WHERE comment_id = $1;`
    const writeQuery = `UPDATE comments
                    SET votes = $1
                    WHERE comment_id = $2
                    RETURNING *;`

    const readResponse = await db.query(readQuery, [comment_id])

    const oldVotes = readResponse.rows[0].votes
    const newVotes = oldVotes + inc_votes

    const writeResponse = await db.query(writeQuery, [newVotes, comment_id])

    return writeResponse.rows[0]

}

exports.updateCommentBody = async ( comment_id, body ) => {

    const query = `UPDATE comments
                    SET body = $1
                    WHERE comment_id = $2
                    RETURNING *;`

    const response = await db.query(query, [body, comment_id])

    return response.rows[0]

}