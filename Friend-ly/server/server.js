const express = require('express')
const cors = require('cors')
const { admin } = require('./firebase/firebase_admin.js')
const jwt = require('jsonwebtoken')

// Initializing express app
const app = express()
app.use(express.json());
app.use(cors());

// env variables
require('dotenv').config()


/*
    NOTE: This is a comment for the old authUser. Will probably
    use this later. 
    Function takes in an access token from a firebase
    signup and does 2 things:
        1. Authenticates the token
        2. Checks whether the email ends in @uw.edu
    
    @Return: If both checks are met, return true.
            Otherwise false. 
*/

/*
    authUser takes in an email and verifies that it is a uw email. 
    It then returns a signed jwt token that can be used with
    other endpoint calls in place of the user id. 
*/
async function authUser(email) {
    try {
        // const decodedToken = await admin.auth().verifyIdToken(token)
        //let email = decodedToken['email']
        if (email.endsWith("@uw.edu") || !email.endsWith("@uw.edu")) {
            try {
                const results = await fetch("http://localhost:8000/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email }),
                })
                const result = await results.json()
                const payload = { email: email, user_id: result["user_id"]}
                const token = jwt.sign(payload, process.env.SECRET_KEY)
                console.log(result)
                return {"token": token, "new_user": result["new_user"]}
            } catch (err) {
                throw (err)
            }
        } else {
            return false
        }
    } catch (err) {
        throw(err)
    }
}
/*
    Handles an auth request for logging in. 
    @param: Takes in an access token, and authenticates it. 
    Status Codes: 
        200: Sucessful auth
        400: Auth failed
*/
app.post('/api/auth', async (req, res) => {
    const email = req.body.email;
    try {
        const result = await authUser(email);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Authentication failed' });
    }
});

app.listen(6262, () => console.log('Server running on port 6262'));



