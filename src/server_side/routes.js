/**
 * routes.js
 * 
 * Author: Bilal Vandenberge
 * Date:   March 2026
 * Brief:  Handle routes in client requests
 */

const express = require('express');
const { randomPassword, isValidLength } = require('./utils');
const app = express();

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

app.post("/profils", (req, res, next) => {
    res.status(200);
    res.json({
        return: 322500,
        message: "create user"
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