const db = require('../db/connection.js')

exports.selectCategories = async () => {

    const response = await db.query('SELECT * FROM categories;')

    return response.rows

}

exports.insertCategory = async (slug, description) => {

    const query = `INSERT INTO categories
                    (slug, description)
                    VALUES
                    ($1, $2)
                    RETURNING *;`
    const queryParams = [slug, description]

    const response = await db.query(query, queryParams)

    return response.rows[0]

}