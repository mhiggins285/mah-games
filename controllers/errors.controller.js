exports.invalidEndpoint = (req, res) => {

    return res.status(404).send({ message: "Endpoint does not exist" })

}