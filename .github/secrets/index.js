const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || "shh"

function accessToken(user){
    const payload = {
        subject: user.id,
        username: user.username
    }

    const options = {
        expiresIn: '2d'
    }

    const token = jwt.sign(payload, JET_SECRET, options)
    return token
}

module.exports = {
    accessToken,
    JWT_SECRET
}