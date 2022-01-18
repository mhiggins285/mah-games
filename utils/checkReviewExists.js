const db = require('../db/connection.js')

exports.checkReviewExists = async (review_id) => {

    const query = `SELECT * FROM reviews
                    WHERE review_id = $1;`

    const response = await db.query(query, [review_id])

    return !(response.rows.length === 0)

}
