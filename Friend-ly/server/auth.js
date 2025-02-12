const express = require("express");
const jwt = require('jsonwebtoken')

function authenticateToken(token){
    if (!token) return 401 // will be status when this is called in posts
    let auth = null
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => { 
        if (!err) {auth = user}
    })
    return auth
}

const middleware = (req, res, next) => {
    const token = req.body['token']
    if (!token) {
        return res.status(401).send({ error: "No token provided" }); // Unauthorized
    }
    console.log(token)
    /*const auth = authenticateToken(token);
    if (!auth) {
        return res.status(403).send({ error: "Failed to authenticate token" }); // Forbidden
    }*/
    // req.user = auth; // Attach the authenticated user's info to req
    next(); // Pass control to the next middleware/route handler
}

module.exports = middleware