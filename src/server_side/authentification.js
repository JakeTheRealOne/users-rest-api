/**
 * authentification.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Check if user is authentificated
 */

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT_SECRET);
        const id = decoded.userId;
        req.auth = {
            userId: id
        };
        next();
    } catch (error) {
        res.status(401).json({
            return: 322510
        });
    }
}