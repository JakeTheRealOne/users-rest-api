/**
 * routes.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Handle routes in client requests
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { randomPassword, isValidLength, isValidCInput, isValidEmail, tokenSecret } = require('./utils');
const { emailExists, addUser } = require('./database');
const app = express();

app.use(express.json());

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

    if (!isValidCInput(input_email, input_username, input_password, input_isadmin)) { // Missing email, username or password in json
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

// app.post("/connexion", async (req, res, next) => {
//     const input_email = req.body.email;
//     const input_password = req.body.password;

//     res.status(200);
//     res.json({
//         return: 322500,
//         id: "USER ID",
//         token: jwt.sign(
//             { userId: user._id },
//             tokenSecret(),
//             { expiresIn: '24h' }
//         ),
//     });
//     next();
// })

app.delete("/profils/:id", (req, res, next) => {
    res.status(200);
    res.json({
        return: 322500,
        message: `delete user with id ${req.params.id}`
    });
    next();
});

app.get("/profils", (req, res, next) => {
    res.status(200);
    res.json({
        return: 322500,
        message: "read all users"
    });
    next();
});

app.get("/profils/:id", (req, res, next) => {
    res.status(200);
    res.json({
        return: 322500,
        message: `read user with id ${req.params.id}`
    });
    next();
});

app.put("/profils/:id", (req, res, next) => {
    res.status(200);
    res.json({
        return: 322500,
        message: `modify user with id ${req.params.id}`
    });
    next();
});

module.exports = app;