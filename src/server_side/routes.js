/**
 * routes.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Handle routes in client requests
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { randomPassword, isValidLength, isValidCreateInput, isValidEmail, tokenSecret, isValidLoginInput, verify } = require('./utils');
const { emailExists, addUser, hashedPasswordOf, idOf, deleteUser, getAllUsers, getUser } = require('./database');
const authentification = require('./authentification');
const authorization = require('./authorization');
const I_am_me = require('./I_am_me');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get("/motdepasse/:length", (req, res, next) => {
    const length = req.params.length;
    if (isValidLength(length)) {
        res.status(200);
        res.json({
            return: 322500,
            password: randomPassword(length)
        });
    } else {
        res.status(400);
        res.json({
            return: 322509
        });
    }
    next();
});

app.post("/profils", async (req, res, next) => {
    const input_email = req.body.email;
    const input_username = req.body.username;
    const input_password = req.body.password;
    const input_isadmin = req.body.isadmin;

    if (!isValidCreateInput(input_email, input_username, input_password, input_isadmin)) { // Missing email, username or password in json
        res.status(400);
        res.json({
            return: 322504
        });
    } else if ((await emailExists(input_email)) === 1) { // User already registered
        res.status(409);
        res.json({
            return: 322506
        });
    } else if ((await emailExists(input_email)) === -1) { // Database error
        res.status(500);
        res.json({
            return: 322502
        });
    } else if (!(await isValidEmail(input_email))) { // Invalid email
        res.status(400);
        res.json({
            return: 322507
        });
    } else if (!(await addUser(input_email, input_username, input_password, input_isadmin))) {
        res.status(500);
        res.json({
            return: 322502
        });
    } else {
        res.status(200);
        res.json({
            return: 322500
        });
    }

    next();
});

app.post("/connexion", async (req, res, next) => {
    const input_email = req.body.email;
    const input_password = req.body.password;

    if (!isValidLoginInput(input_email, input_password)) { // Bad json
        res.status(400).json({
            return: 322504
        });
        next();
    } else if ((await emailExists(input_email)) !== 1) { // Email not registered
        res.status(400).json({
            return: 322507
        });
        next();
    } else if (!(await verify(input_password, await hashedPasswordOf(await idOf(input_email))))) {
        res.status(400).json({
            return: 322505
        });
        next();
    } else {
        res.status(200);
        res.json({
            return: 322500,
            id: String(await idOf(input_email)),
            token: jwt.sign(
                { userId: String(await idOf(input_email)) },
                tokenSecret(),
                { expiresIn: '24h' }
            ),
        });
        next();
    }
})

app.delete("/profils/:id", authentification, authorization, async (req, res, next) => {
    const input_id = req.params.id;
    if (!(await deleteUser(input_id))) {
        res.status(500);
        res.json({
            return: 322502
        });
    } else {
        res.status(200);
        res.json({
            return: 322500
        });
    }

    next();
});

app.get("/profils", authentification, authorization, async (req, res, next) => {
    try {
        const docs = await getAllUsers();
        if (docs === null) {
            res.status(500).json({
                return: 322502
            })
        } else {
            res.status(200).json({
                return: 322500,
                users: docs
            })
        }
    } catch (err) {
        res.status(500).json({
            return: 322501
        })
    }

    next();
});

app.get("/profils/:id", authentification, async (req, res, next) => {
    const targetId = req.params.id

    try {
        const doc = await getUser(targetId);
        res.status(200).json({
            return: 322500,
            user: doc
        })
    } catch (err) {
        res.status(500).json({
            return: 322501
        })
    }

    next();
});

app.put("/profils/:id", authentification, I_am_me, (req, res, next) => {
    res.status(200);
    res.json({
        return: 322500,
        message: `modify user with id ${req.params.id}`
    });
    next();
});

module.exports = app;