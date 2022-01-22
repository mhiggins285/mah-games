const db = require('../db/connection.js')

exports.selectUsers = async () => {

    const response = await db.query('SELECT username FROM users;')

    return response.rows

}

exports.selectUserByUsername = async (username) => {

    const query = `SELECT * FROM users 
                    WHERE username = $1;`

    const response = await db.query(query, [username])

    return response.rows[0]

}