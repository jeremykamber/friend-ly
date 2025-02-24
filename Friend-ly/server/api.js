/**
 * Names: Henok Assalif, {team member 2 insert name here},
 * {team member 3 insert name here}
 *
 * Date Started: 12/23/2024
 *
 * Description: This file contains the API for the Friend-ly app. {Insert more
 * description here later when fleshed out}
 */

"use strict";

// Module imports:

// Importing the express module
const express = require("express");
const app = express();

// Importing the body-parser module
const multer = require("multer");

// importing the jwt token module
const jwt = require("jsonwebtoken")

// importing mysql2
const mysql = require('mysql2/promise')

// env variables
require('dotenv').config()


// Middleware (Boilerplate code):

// For data sent as form-urlencoded (application/x-www-form-urlencoded)
app.use(express.urlencoded({extended: true}));

// For data sent as json (application/json)
app.use(express.json());

// For data sent as a form (required for FormData use in frontend by the client)
app.use(multer().none());


// Importing the fs module for file reading and writing (Probably gonna use it)
const fs = require('fs').promises;

// Global variables:

const SUCCESS_CODE = 200;
const SERVER_ERROR_CODE = 500;
const USER_ERROR_CODE = 400;
const DEFAULT_PORT = 8000;

let database;

// Start of the API

// {fill out after dicussing with the teamwho will do what}


// End of the API

// Helper functions:
/* Establishes a database connection to the database and returns the database object.
* Any errors that occur should be caught in the function that calls this one.
* @returns {SQL Database} - The database object for the connection.
*/

/**
 * Establishes a server connection and returns an instance of it.
 * @returns {SQLConnection} - A SQL Connection
 */
async function getSQLConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,    // Replace with your database host
      user: process.env.DB_USER,// Replace with your database username
      password: process.env.DB_PASSWORD,// Replace with your database password
      database: process.env.DB_NAME// Replace with your database name
    });
    console.log("Friend-ly DB connected. ")
    return connection;
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    throw err;
  }
}

/**
 * Closes a connection to a server
 * @param {SQLConnection} database - A connection to a database
 */
async function closeSQLConnection(database) {
  await database.end();
  console.log("Connection has been closed.")
}

// TODO: Implement a status code for the type of query was executed and the
// code helps with client of the function to understand which type of data
// format to get back (e.g a select query will return a JSON array while a
// Insert into query will return other information)

/**
 * Executes a SQL query on the connection passed to the function
 * @param {SQLConnection} database - A connection to our database
 * @param {String} query - A SQL query in string format
 * @returns {JSON[]} - An array of JSON objects representing
 */
async function queryDatabase(database, query) {
  // Handle empty case later
  if (query === "") {
    // Boilerplate for testing now
    query = 'SELECT m.chat_id, m.message_id, m.message_text, m.sent_at, u.username AS sender '+
    'FROM messages m '+
    'JOIN users u ON m.sender_id = u.user_id '+
    'WHERE m.chat_id = 2 '+
    'ORDER BY m.sent_at ASC; ';
  }
  const [results, fields] = await database.execute(query);
  return results;
}

/**
 * Returns back all chat history for a single chat
 */
app.get('/chats/:chat_id', async (req, res) => {
  const id = req.params.chat_id
  const [results, fields] = await database.execute(
    'SELECT * FROM messages WHERE chat_id = ?', [id]);
  res.json(results)
});

app.get('/chats/:chat_id/users', async(req, res) => {
  const chat_id = req.params.chat_id
  const [results, fields] = await database.execute(
    'SELECT user_id FROM chatMembers WHERE chat_id = ?', [chat_id]);
  res.json(results);
})



// Gets a single users information
app.get('/users/:id', async function(req, res) {
  let userId = req.params.id;
  let query = "SELECT * FROM users WHERE user_id = ?;";

  try {
    const resultArr = await database.execute(query, [userId]);
    /**
     * This is the actual result set of the query.
     *     If the query is a SELECT, rows will be an array of objects where
     * each object represents a row.
     * If the query is an INSERT, UPDATE, or DELETE, rows will contain
     * metadata, such as affectedRows and insertId.
     */
    const records = resultArr[0];
    const metaData = resultArr[1];

    // Send back users information to frontend
    res.json(records);
  } catch (error) {
    res.type("text").status(SERVER_ERROR_CODE)
      .send("An error occurred on the server. Try again later.");
  }
});

/**
 * Sets the most recent message seen by the specified user in a particular
 * conversation.
 */
app.post('/seen/updateSeen', async function (req, res) {
  let message_id = req.body.message_id;
  let user = req.body.user_id;
  let chat = req.body.chat_id;
  let query = "UPDATE seen SET message_id = ? WHERE user_id = ? AND chat_id = ?;";

  if (message_id && user && chat) {
    try {
      const resultArr = await database.execute(query, [message_id, user, chat]);
      const records = resultArr[0];
      const metaData = resultArr[1];

      // Later write code that sends back correct part of the metaData.
      res.type("text").status(SUCCESS_CODE)
          .send("Successfully set the most recent message for specified user");
    } catch (error) {

    }
  } else {
    res.type("text").status(USER_ERROR_CODE)
      .send("The username, ")
  }
});

// Posts new message into user chat
app.post('/users/:chat_id/newMessage', async function (req, res) {
  let token = req.body.token
  let creator_id = jwt.verify(token, process.env.SECRET_KEY)
  let user_id = creator_id.user_id[0].user_id
  let chatID = req.params.chat_id
  let messageText = req.body.messageText
  let query = 'INSERT INTO messages(chat_id, sender_id, message_text) VALUES (?, ?, ?)'
  try {
    const resultArr = await database.execute(query, [chatID, user_id, messageText]);
    const records = resultArr[0];
    const metaData = resultArr[1];

    // Later write code that sends back correct part of the metaData.
    res.type("text").status(SUCCESS_CODE)
        .send("Successfully posted a new message into user chat.");
  } catch (error) {
    res.type("text").status(USER_ERROR_CODE).send("Post new message failed.")
  }

})

/**
 * Post a new chat/conversation to chats table and
 * add users to chatMembers table
 */
app.post('/chats/newConversation', async (req, res) => {
  console.log(req.body)
  let chat_name = req.body.chat_name
  let profile_pic = req.body.profile_pic
  let token = req.body.token
  let creator_id = jwt.verify(token, process.env.SECRET_KEY)
  let user_ids = req.body.user_ids
  user_ids.push(creator_id.user_id[0].user_id)
  let insertChatsQuery = 'INSERT INTO chats(chat_name, profile_picture) VALUES (?, ?)'
  let insertMembersQuery = 'INSERT INTO chatMembers (chat_id, user_id) VALUES (?, ?)'

  try {
    // add to chats table
    const resultArr = await database.execute(insertChatsQuery, [chat_name, profile_pic])
    const records = resultArr[0];
    const metaData = resultArr[1];
    // get the new chat id
    let chat_id = records.insertId;


    // add to chatMembers table
    for (let i = 0; i < user_ids.length; i++) {
      let user_id = user_ids[i]
      const resultArr = await database.execute(insertMembersQuery, [chat_id, user_id]);
      const records = resultArr[0];
      const metaData = resultArr[1];

      // note: cannot put try catch for some reason here
      // reason: got this error: Cannot set headers after they are sent to the client
    }

    res.type("text").status(SUCCESS_CODE)
        .send("Successfully posted a new chat in chats table and chatMembers table");
  } catch (error) {
    res.type("text").status(USER_ERROR_CODE).send("Post new chat failed.")
  }
})

/**
 * Gets the last message for every chat a certain user is in.
 */
app.get('/users/:token/getLastMessageHistory', async (req, res) => {
  console.log(req.params.token)
  const token = req.params.token
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
  const user_id = decodedToken.user_id[0].user_id
  console.log(user_id)
  try {
    const [results, fields] = await database.execute(
      'SELECT m.chat_id, m.message_text, m.sent_at, m.sender_id ' +
      'FROM messages m ' +
      'WHERE m.message_id IN ( ' +
      '   SELECT MAX(sub_m.message_id) ' +
      '   FROM messages sub_m ' +
      '   GROUP BY sub_m.chat_id ' +
      ')' +
      'AND m.chat_id IN ( ' +
      '   SELECT c.chat_id ' +
      '   FROM chatMembers c ' +
      '   WHERE c.user_id = ? ' +
      ')' +
      'ORDER BY m.sent_at DESC', [user_id]
    )
    res.type("text").status(200).send(results);
  } catch (err) {
    res.type("text").status(USER_ERROR_CODE).send("Getting last message of all chats failed.")
  }
})

app.get('/users/:chat_id', async (req, res) => {
  const chat_id = req.params.chat_id;
  const query = "SELECT m.message_text FROM message AS m WHERE m.chat_id = ? AND m.sent_at = ( SELECT MAX(m2.sent_at) FROM message AS m2 WHERE m2.chat_id = ?);"
  const [results, fields] = await database.execute(query, [chat_id, chat_id]);
  res.json(results);
})


/**
 * Adds a new user (or a list of users) to a given chat.
 * User ids must be Strings.
 */
app.post('/chats/addUser', async (req, res) => {
  const { chat_id, user_ids } = req.body
  try {
    const result = await addUser(chat_id, user_ids);
    if (result.success) {
      res.type("text").status(200).send(result.message);
    } else {
      res.type("text").status(400).send(result.message);
    }
  } catch (error) {
    res.type("text").status(500).send("Couldn't add a new user.");
  }

})


async function addUser(chat_id, user_ids) {
  /*if (!user_ids.every(item => typeof item === "number")) {
    return { success: false, message: "Not all user_ids are integers." };
  }*/

  let query = 'INSERT INTO chatMembers (chat_id, user_id) VALUES (?, ?)'
  for (let i = 0; i < user_ids.length; i++) {
    let user_id = user_ids[i]
    try {
      const resultArr = await database.execute(query, [chat_id, user_id]);
      const records = resultArr[0];
      const metaData = resultArr[1];
      // Later write code that sends back correct part of the metaData.
    } catch (error) {
      return { success: false, message: "Adding a new user failed"}
    }
  }
  return { success: true, message: "Successfully posted new users to the chat."}
}

// Above were endpoint pertaining the chatbox features. Below are endpoints
// regarding the following feature

// Set friendship state when a request is initally sent
app.post('addfriend/:user_id1/:user_id2/sendFriendRequest', async (req, res) => {
  const user_id1 = req.body.user_id1;
  const user_id2 = req.body.user_id2;

  try {
    const query = "INSERT INTO addFriend (friend1, friend2, accepted) VALUES (?, ?, false)"

    // Perform the async process
    await database.execute(query, [user_id1, user_id2]);

    res.type("text").status(200).send("Successfully made the relationship");
  } catch (error) {
    console.log("Something wrong occurred when sending a friend request");
    console.error(error);
  }
});

app.post('/users/login', async (req, res) => {
  const email = req.body.email

  try {
    const findUserQuery = "SELECT * FROM users WHERE email = ?"
    const results = await database.execute(findUserQuery, [email])
    if (results[0].length == 0) {
      // add the user
      const profile_picture = null
      const addUserQuery = "INSERT INTO users (bio, email, profile_picture, username) VALUES (?, ?, ?, ?)"
      await database.execute(addUserQuery, ["Hi, I am " + email, email, profile_picture, email])
      //res.type("text").status(200).send("Successfully added a user into the database!")
    } 
    const getIDQuery = "SELECT user_id FROM users WHERE email = ?"
    const result = await database.execute(getIDQuery, [email])
    console.log(result)
    res.type("text").status(200).send(result[0])
    
  } catch (err) {
    throw (err)
  }
})


// Allows us to change the port easily by setting an environment
// variable. If no environment variable is set, the port will default to 8000
const PORT = process.env.PORT || DEFAULT_PORT;


/*
Later on, we will change the directory name to the appropriate name for the
front-end files

// Tells the code to serve static files in a directory called 'public'
app.use(express.static('{directory name}'));
*/

// Tells the application to run on the specified port
app.listen(PORT, async (err) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
    process.exit(1);
  } else {
    console.log(`Server running on port ${PORT}`);
    database = await getSQLConnection()
    let query = await queryDatabase(database, "")
    console.log(query)
    //closeSQLConnection(database)

  }
});
