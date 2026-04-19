/**
 * database.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Handle mongodb requests
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator').default;
const { verify, encrypt } = require('./utils');
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

    const encrypted_pw = await encrypt(password);
    if (encrypted_pw !== null) {
        const user = new model({
            "email": email,
            "username": username,
            "password": encrypted_pw,
            "isadmin": isadmin
        });
        await user.save().then(() => {
            console.log("[MongoDB] new user created - " + email);
            success = true;
        }).catch((error) => {
            console.log("[MongoDB] error - " + error);
        });
    }

    return success;
}

// Add user to db (no check done)
async function editUser(targetId, email, username, password, isadmin) {
    const encrypted_pw = password ? (await encrypt(password)) : null; // Hash new password
    const updates = {
        email,
        username,
        "password": encrypted_pw,
        isadmin
    };
    const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => (v !== null))
    );

    if (!(await initDB())) {
        return false;
    }

    let success = false;
    model = getDB();

    try {
        const updated = await model.findByIdAndUpdate(
            targetId,
            { $set: filteredUpdates },
            { new: true }
        );
        success = (updated !== null);
    } catch (error) {
        console.log("[MongoDB] error - " + error);

    }

    return success;
}

// Remove user from db (no check done)
async function deleteUser(id) {
    if (!(await initDB())) {
        return false;
    }

    try {
        model = getDB();
        const user = await model.findByIdAndDelete(id);
        if (user) {
            console.log(`[MongoDB] user deleted - ${user.email}`);
        } else {
            throw Error("Unkown document in database");
        }
    } catch (err) {
        return false;
    }
    return true;
}

async function getUser(id) {
    if (!(await initDB())) {
        return null;
    }
    model = getDB();
    const user = await model.findById(id).select('-password -__v');
    return user;
}

// Check if a user is an admin
async function isAdmin(id) {
    if (id === null) {
        return null;
    }

    const user = await model.findById(id);
    return user ? user.isadmin : null;
}

// Check that the email and the id are from the same user
async function emailIdMatch(id, email) {
    if (email === null) {
        return true;
    }
    if (id === null) {
        return false;
    }

    const actualId = await idOf(email);
    return !actualId || actualId.equals(id);
}

// Return the _id of an email adress
async function idOf(email) {
    if (!(await initDB())) {
        return null;
    }

    model = getDB();

    try {
        const user = await model.findOne({ email: email });
        return user ? user._id : null;
    } catch (err) {
        throw err;
    }
}

// Return the hashed password of a user
async function hashedPasswordOf(id) {
    if (id === null) {
        return null;
    }

    const user = await model.findById(id);
    return user ? user.password : null;
}

// Check if a user exists
async function exists(id) {
    if (!(await initDB())) {
        return false;
    }
    model = getDB();
    return (await model.exists({ _id: id })) !== null;
}

// Get all users in the db (password omited)
async function getAllUsers() {
    if (!(await initDB())) {
        return null;
    }
    model = getDB();
    const users = await model.find({}).select('-password -__v');
    return users;
}

module.exports = { initDB, emailExists, usernameExists, addUser, editUser, deleteUser, isAdmin, getUser, hashedPasswordOf, idOf, exists, getAllUsers, emailIdMatch };