const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication invalid'})
    }
    try {
        const { username, userid} = jwt.verify(authHeader, 'secret')
        req.user = {username, userid}
        next()
    } catch(error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Authentication invalid'})
    }
    
}
module.exports = authMiddleware