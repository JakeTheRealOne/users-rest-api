/**
 * routes.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Handle routes in client requests
 */

const express = require('express');
const { randomPassword, isValidLength, isValidCInput, isValidEmail } = require('./utils');
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
            return: 322510
        });
    }
    next();
});

app.post("/profils", async (req, res, next) => {
    const input_email = req.body.email;
    const input_username = req.body.username;
    const input_password = req.body.password;

    // if (!isValidCInput(input_email, input_username, input_password)) { // Missing email, username or password in json
    //     res.status(400);
    //     res.json({
    //         return: 322504
    //     });
    // } else if () { // User already registered
    //     res.status(409);
    //     res.json({
    //         return: 322507
    //     });
    // } else if (!isValidEmail(input_email)) { // Invalid email
    //     res.status(400);
    //     res.json({
    //         return: 322508
    //     });
    // } else {

    // }

    const v = await isValidEmail(input_email);

    res.status(200);
    res.json({
        return: 322500,
        message: `create user (email ${v})`
    });
    next();
});

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