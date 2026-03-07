/**
 * utils.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Utilities
 */

const crypto = require('crypto');

function randomCharacter() {
    const rng = crypto.randomInt(0, 61);

    if (rng < 10) { // 0-9
        return String(rng);
    } else if (rng < 36) { // a-z
        return String.fromCharCode(rng + 97 - 10);
    } else { // A-Z
        return String.fromCharCode(rng + 65 - 36);
    }
}

function randomPassword(length) {
    let password = "";
    for (let i = 0; i < length; ++i) {
        password += randomCharacter(i);
    }
    return password;
}

// Check if a string is a valid length (0..61)
function isValidLength(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0 && n <= 60;
}

module.exports = { randomPassword, isValidLength };