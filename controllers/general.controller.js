const fs = require('fs/promises')

exports.getEndpoints = (req, res, next) => {

    return fs.readFile('endpoints.json', 'utf-8')
        .then((endpoints) => {

            res.status(200).send(endpoints)

        })

}