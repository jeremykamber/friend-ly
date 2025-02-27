const express = require("express");
const jwt = require('jsonwebtoken')

/*
  Takes in a jwt token and verifies it. Then returns
  either the id contained within the token, or false if 
  the token can't be verified. 
*/
function getIDFromToken(token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
  if (decodedToken) {
    return decodedToken.user_id[0].user_id
  }
  return false;
}

/*
    Takes in a token, which is passed through req.body
    Authenticates the token and returns the user_id contained
    within the token if authentication is successful. 
*/
const authMiddleware = (req, res, next) => {
    const token = req.body.token
    if (!token) {
        return res.status(401).send({ error: "No token provided" }); // Unauthorized
    }
    const auth = getIDFromToken(token);
    if (!auth) {
        return res.status(403).send({ error: "Failed to authenticate token" }); // Forbidden
    }
    req.user_id = auth; // Attach the authenticated user's info to req
    next(); // Pass control to the next middleware/route handler
}

module.exports = authMiddleware