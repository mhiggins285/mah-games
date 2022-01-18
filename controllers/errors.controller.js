exports.invalidEndpoint = (req, res) => {

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