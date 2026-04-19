/**
 * authorization.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Check if user has admin permissions to acces resources
 */

const { isAdmin } = require('./database');

module.exports = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        if (!userId || !(await isAdmin(userId))) {
            throw Error("Missing admin permissions");
        }
        next();
    } catch (error) {
        res.status(401).json({
            return: 322503
        });
    }
}