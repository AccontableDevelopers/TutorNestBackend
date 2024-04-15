const jwt = require("jsonwebtoken")
require("dotenv").config()

export function accessToken (user){
    const payload = {
        _id : user._id
    }
    const token = jwt.sign(payload,process.env.ACCESS_SECRET,{expiresIn:process.env.ACCESS_EXPIRES})
    return token
}

export function refreshToken (user){
    const payload = {
        _id: user._id
    }
    const token = jwt.sign(payload, process.env.REFRESH_SECRET,{expiresIn:process.env.REFRESH_EXPIRES})
    return token
}

export function verifyToken (token){
    return jwt.verify(token,process.env.ACCESS_SECRET)
}