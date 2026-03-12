/**
 * I_am_me.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Check if the target is myself
 */

const { isAdmin } = require('./database');

module.exports = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const targetId = req.params.id;
        console.log(userId);
        console.log(targetId);
        if (!userId || !targetId || userId !== targetId) {
            throw Error("You are not you");
        }
        next();
    } catch (error) {
        res.status(401).json({
            return: 322511
        });
    }
}