/**
 * authentification.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Check if user is authentificated
 */

const jwt = require("jsonwebtoken");
const { exists } = require('./database');
const { JWT_SECRET } = require('./config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT_SECRET);
        const id = decoded.userId;

        if (!exists(id)) {
            throw("User no longer in database");
        }

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