exports.checksMethodNotAllowed = (req, res, next) => {

  const availableEndpoints = ['/api', '/api/categories', '/api/users', '/api/users/:username', '/api/reviews', '/api/reviews/:review_id/comments', '/api/comments/:comment_id']

  if (availableEndpoints.includes(req.url)) {

    return res.status(405).send({ message: "Method not allowed" })

  } else {

    next()

  }

}

exports.handlesInvalidEndpoint = (req, res) => {

  return res.status(404).send({ message: "Endpoint does not exist" })

}

exports.handlesCustomErrors = (err, req, res, next) => {

    if (err.status) {
      res.status(err.status).send({ message: err.message })
    } else {
      next(err)
    }
}

exports.handlesUnspecifiedErrors = (err, req, res, next) => {
  
    console.log(err)
  
    res.status(500).send({ message: "Something went wrong" })
  
}