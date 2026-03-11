/**
 * utils.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Utilities
 */

const crypto = require('crypto');
const { ZERUH_API_KEY } = require('./config');

// #### password ####

// Generate a random character with crypto lib
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

// Generate a random password with crypto lib
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

// #### Create user ####

// Check if an email adress exists
async function isValidEmail(str) {
    const zeruh_url = new URL('https://api.zeruh.com/v1/verify');
    zeruh_url.searchParams.append("api_key", ZERUH_API_KEY);
    zeruh_url.searchParams.append("email_address", str);

    let isValid = false;
    await fetch(zeruh_url.href)
        .then(response => response.json())
        .then(data => {
            isValid = data.result.validation_details.smtp_check;
        }
        )
        .catch(() => {
            // pass
        })

    return isValid;
}

function isValidCInput(email, username, password) {
    return (email !== undefined &&
        username !== undefined &&
        password !== undefined);
}

module.exports = { randomPassword, isValidLength, isValidEmail, isValidCInput };