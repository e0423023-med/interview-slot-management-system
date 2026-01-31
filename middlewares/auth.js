const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        
        if (!token) {
            return res.status(401).json({ "message": "No token provided" })
        }
        const tokenString = token.replace('Bearer ', '')
        
        const decoded = jwt.verify(tokenString, "akanakan")
                req.user = decoded.user
        
        next()
    } catch (err) {
        console.log("Auth error:", err)
        return res.status(401).json({ "message": "Invalid token" })
    }
}

module.exports = auth