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

exports.insertUser = async (username, name, avatar_url) => {

    const query = `INSERT INTO users
                    (username, name, avatar_url)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *;`
    const queryParams = [username, name, avatar_url]

    const response = await db.query(query, queryParams)

    return response.rows[0]

}

exports.updateUser = async ( username, name, avatar_url ) => {
    
    let setLine = ''
    let queryParams = []

    if (name !== undefined && avatar_url !== undefined) {

        setLine = 'SET name = $2, avatar_url = $3'
        queryParams = [username, name, avatar_url]

    } else if (name !== undefined) {

        setLine = 'SET name = $2'
        queryParams = [username, name]

    } else {

        setLine = 'SET avatar_url = $2'
        queryParams = [username, avatar_url]

    }

    const query = `UPDATE users
                    ${setLine}
                    WHERE username = $1
                    RETURNING *;`

    const response = await db.query(query, queryParams)

    return response.rows[0]

}