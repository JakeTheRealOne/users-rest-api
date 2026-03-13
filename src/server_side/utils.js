/**
 * utils.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Utilities
 */

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { ZERUH_API_KEY, PW_SALT_ROUNDS, JWT_SECRET } = require('./config');

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

// Check if the json input of user creation is valid
function isValidCreateInput(email, username, password, isadmin) {
    return (email !== undefined &&
        username !== undefined &&
        password !== undefined &&
        isadmin !== undefined);
}

// Encrypt a password for db storage
async function encrypt(password) {
    let result = null;
    await bcrypt.hash(password, PW_SALT_ROUNDS).then((hash) => {
        result = hash;
    }).catch((err) => {
        console.log("[Bcrypt] encrypt err - " + err);
    });
    return result;
}

// Check if password is same as db
async function verify(plain_pw, saved_pw) {
    if (saved_pw === undefined) {
        return false;
    }
    try {
        const isValid =  await bcrypt.compare(plain_pw, saved_pw);
        return isValid;
    } catch (err) {
        console.log("[Bcrypt] verify err - " + err);
    }

    return false;
}

// #### Login ####

// Check if the json input of user login is valid
function isValidLoginInput(email, password) {
    return (email !== undefined &&
        password !== undefined);
}


// Get the secret for the web token
function tokenSecret() {
    return JWT_SECRET;
    //return crypto.randomBytes(32).toString('hex');
}

module.exports = { randomPassword, isValidLength, isValidEmail, isValidCreateInput, encrypt, verify, tokenSecret, isValidLoginInput };