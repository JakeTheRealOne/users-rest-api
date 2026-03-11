/**
 * database.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Handle mongodb requests
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { auth, encrypt } = require('./utils');
const { MONGODB_USERNAME, MONGODB_PASSWORD } = require('./config');

function urlDB() {
    return `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@users3225.urlyaer.mongodb.net/?appName=users3225`
}

// Init database, return 1 if success
async function initDB() {
    let success = false;
    await mongoose.connect(urlDB())
        .then(() => { success = true })
        .catch(() => console.log('[MongoDB] Connection failed'));

    return success;
}

// Get the model for Users schema
function getDB() {
    const usersSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        isadmin: { type: Boolean, required: true },

        created: {
            type: Date,
            default: Date.now
        },
        lastmodified: {
            type: Date,
            default: Date.now
        },
    });

    usersSchema.plugin(uniqueValidator);
    const usersModel = mongoose.models.Users || mongoose.model('Users', usersSchema);
    return usersModel;
}

// Return if an email exists (RET = -1: db error, 1/0: bool)
async function emailExists(str) {
    if (!(await initDB())) {
        return -1;
    }

    model = getDB();

    const exists = await model.exists({ email: str });
    return (exists !== null) ? 1 : 0;
}

// Return if a username exists
async function usernameExists(str) {
    if (!(await initDB())) {
        return -1;
    }

    model = getDB();
    const exists = await model.exists({ username: str });
    return (exists !== null) ? 1 : 0;
}

// Add user to db (no check done)
async function addUser(email, username, password, isadmin) {
    if (!(await initDB())) {
        return false;
    }

    let success = false;
    model = getDB();

    const user = new model({
        "email": email,
        "username": username,
        "password": await encrypt(password),
        "isadmin": isadmin
    });

    await user.save().then(() => {
        console.log("[MongoDB] new user created - " + email);
        success = true;
    }).catch((error) => {
        console.log("[MongoDB] error - " + error);
    });

    return success;
}

// Remove user from db (no check done)
function removeUser(id) {
    // TODO
}

// Edit user from db (no check done)
//  Only edit defined fields
function editUser(
    id,
    newemail = undefined,
    newusername = undefined,
    newpassword = undefined,
    newisadmin = undefined,
) {
    // TODO
}

function isAdmin(id) {
    // TODO -> bool
}

function hashedPasswordOf(id) {
    // TODO -> str
}

function getUser(id) {
    // TODO -> {id, email, username, isadmin, cdate, lmdate}
}

module.exports = { initDB, emailExists, usernameExists, addUser, editUser, removeUser, isAdmin, getUser };