const db = require('../db/connection.js')

exports.checkCommentExists = async (comment_id) => {

    const query = `SELECT * FROM comments
                    WHERE comment_id = $1;`

    const response = await db.query(query, [comment_id])

    return !(response.rows.length === 0)

}
