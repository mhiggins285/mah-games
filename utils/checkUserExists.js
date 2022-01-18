const db = require('../db/connection.js')

exports.checkUserExists = async (username) => {

    const query = `SELECT * FROM users
                    WHERE username = $1;`

    const response = await db.query(query, [username])

    return !(response.rows.length === 0)

}
