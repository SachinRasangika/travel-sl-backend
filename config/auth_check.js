const jwt = require('jsonwebtoken')
require("dotenv").config();
const keys = require("../config/keys");

// Check auth middlewares
module.exports = (req, res, next) => {
    
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false;
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(' ')[1]; //Authorization : Bearer <token>
    if (!token || token === '') {
        req.isAuth = false;
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    let decord_token;
    try {
        decord_token = jwt.verify(token, keys.secretOrKey); //compare the screat key
        if (!decord_token) {
            req.isAuth = false
            return res.status(401).json({
                message: "Token not valid"
            })
        }
        req.is_auth = true;
        req.email = decord_token.email;
        req.role = decord_token.role;
        next();
    } catch (error) {
        req.isAuth = false;
        return res.status(401).json({
            message: "Token not valid"
        })
    }
};
