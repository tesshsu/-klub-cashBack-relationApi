const jwt = require('jsonwebtoken')
const User = require('../model/User')
require('dotenv').config()

/*
    This is the middleware used to verify if the requester is authenticated
    or not. Note that, if so, the next() method is called, which makes the
    request to continue as desired by the API consumer. If not, the request
    response is sent right here, and nothing more in the API is executed till
    a new request is done.
*/
const auth = async (req, res, next) => {
    const token = req.body.token || req.query.token || (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_KEY)
            const user = userData.email && await User.getOneByEmail(userData.email)
            
            if (user) {
                req.user = user
                next()
            } else {
                res.status(401).send({ message: 'User not found!' })
            }
            
        } catch(err) {
            res.status(401).send({ message: err.message })
        }
    } else {
        res.status(401).send({ message: 'Authentication needed. Please, provide your credentials.' })
    }
}

module.exports = auth