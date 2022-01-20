const db = require('../db/connection.js')

exports.checkCategoryExists = async (category) => {

    const query = `SELECT * FROM categories
                    WHERE slug = $1;`

    const response = await db.query(query, [category])

    return !(response.rows.length === 0)

}
