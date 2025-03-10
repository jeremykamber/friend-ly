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
const mysql = require('mysql2/promise');
const { getIdToken } = require("firebase/auth");
const authMiddleware = require('./tokenMiddleware')

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
app.post('/users/:chat_id/newMessage', authMiddleware, async function (req, res) {
  let user_id = req.user_id
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
app.post('/chats/newConversation', authMiddleware, async (req, res) => {
  let chat_name = req.body.chat_name
  let profile_pic = req.body.profile_pic
  let user_ids = req.body.user_ids
  user_ids.push(req.user_id)
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
app.get('/users/getLastMessageHistory', authMiddleware, async (req, res) => {
  const user_id = req.user_id
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

/*
  Gets all the messages from one chat.
  Requires a chat id in the URL. 
*/
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

/**
 * GET friend lists for one user
 * Select the rows that includes the user
 */
app.get('/friends/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const query = `
    SELECT 
        CASE 
            WHEN user_id1 < user_id2 THEN user_id1 
            ELSE user_id2 
        END AS user_id1,
        CASE 
            WHEN user_id1 < user_id2 THEN user_id2 
            ELSE user_id1 
        END AS user_id2,
        created_at
    FROM friends
    WHERE user_id1 = ? OR user_id2 = ?
    ORDER BY created_at ASC;
`;
  const [results, fields] = await database.execute(query, [user_id, user_id]);
  res.json(results);
})

/**
 * Sends a new friend request.
 * Adds two users with the default `added` status set to `false`.
 * Constraint: Ensure the request does not already exist in the table.
 */
app.post('/friends/sendFriendRequest', async (req, res) => {
  // the person that sends the friend request
  const user_id1 = req.body.user_id1;
  // the person that accepts the friend request
  const user_id2 = req.body.user_id2;

  try {
    const checkQuery = `
      SELECT * FROM friends 
      WHERE (user_id1 = ? AND user_id2 = ?) 
         OR (user_id1 = ? AND user_id2 = ?) 
      LIMIT 1
    `;

    const [rows] = await database.execute(checkQuery, [user_id1, user_id2, user_id2, user_id1]);
    

    if (rows.length > 0) {
      return res.type("text").status(400).send("Friend request already exists / added.");
    }

    
    const query = "INSERT INTO friends (user_id1, user_id2) VALUES (?, ?)"

    // Perform the async process
    await database.execute(query, [user_id1, user_id2]);

    res.type("text").status(200).send("Successfully send friend request");
    
  } catch (error) {
    res.type("text").status(500).send("Couldn't send friend request.");
  }
});

/**
 * Accepted friend request.
 * Set status to true.
 */

app.post('/friends/acceptFriendRequest', async (req, res) => {
  // the person that sends the friend request
  const user_id1 = req.body.user_id1;
  // the person that accepts the friend request
  const user_id2 = req.body.user_id2;

  try {   
    const query = "UPDATE friends SET added = true WHERE user_id1 = ? and user_id2 = ?"

    // Perform the async process
    await database.execute(query, [user_id1, user_id2]);

    res.type("text").status(200).send("Successfully accept friend request");
    
  } catch (error) {
    res.type("text").status(500).send("Couldn't accept friend request.");
  }
});

/**
 * Remove from friends list
 * Delete the row of the 2 users
 */
app.post('/friends/deleteFriend', async (req, res) => {
  // the person that sends the friend request
  const user_id1 = req.body.user_id1;
  // the person that accepts the friend request
  const user_id2 = req.body.user_id2;

  try {   
    const query = `
      DELETE FROM friends 
      WHERE (user_id1 = ? AND user_id2 = ?) 
         OR (user_id1 = ? AND user_id2 = ?)
    `;

    // Perform the async process
    const [result] = await database.execute(query, [user_id1, user_id2, user_id2, user_id1]);

    if (result.affectedRows > 0) {
      return res.type("text").status(200).send("Successfully deleted friend.");
    } else {
      return res.type("text").status(404).send("Friendship not found.");
    }
    
  } catch (error) {
    res.type("text").status(500).send("Couldn't delete friend.");
  }
});

/**
 * NOTE: Add to interestCategory and interestDetails before 
 * inserting into userInterests due to foreign keys
 */

/**
 * Add one user's interest / multiple interests at once 
 * Param:
 * user_id int
 * interest_ids array[int]
 */

app.post("/addUserInterests", (req, res) => {
  const { user_id, interest_ids } = req.body;

  if (!user_id || !Array.isArray(interest_ids) || interest_ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input' });
  }

  // Normal for loop to insert each interest
  for (let i = 0; i < interest_ids.length; i++) {
      const addQuery = 'INSERT INTO userInterest (user_id, interest_id) VALUES (?, ?)';
      database.query(addQuery, [user_id, interest_ids[i]], (err) => {
          if (err) {
              console.error("Database Error:", err);
          }
      });
  }

  res.status(201).json({ message: 'User interests added successfully' });
});

/**
 * Delete one user's interest
 * Param:
 * user_id int
 * interest_ids array[int]
 */
app.post("/deleteUserInterests", (req, res) => {
  const { user_id, interest_ids } = req.body;

  if (!user_id || !Array.isArray(interest_ids) || interest_ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input' });
  }

  // Normal for loop to delete each interest
  for (let i = 0; i < interest_ids.length; i++) {
      const deleteQuery = 'DELETE FROM userInterest WHERE user_id = ? AND interest_id = ?';
      database.query(deleteQuery, [user_id, interest_ids[i]], (err) => {
          if (err) {
              console.error("Database Error:", err);
          }
      });
  }

  res.status(200).json({ message: 'User interests deleted successfully' });
});







// For adding interest and interestCategory from the server side
/**
 * Add interest category (one at a time)
 */
app.post("/addInterestCategory", (req, res) => {
  const { category_name } = req.body;

  if (!category_name) {
    return res.type("text").status(400).send("Invalid input.");
  }
 
  const addQuery = 'INSERT INTO interestCategory (category_name) VALUES (?)';

  database.query(addQuery, [category_name], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.type("text").status(500).send("Couldn't add interest category.");
    }
  });

  res.status(201).json({ message: 'Interest category added successfully' });
  
});

/**
 * Add interest detail (one at a time)
 */
app.post("/addInterestDetails", async (req, res) => {
  const { interest_name, interest_category_id } = req.body;

  if (!interest_name || !interest_category_id) {
    return res.type("text").status(400).send("Invalid input.");
  }

  const addQuery = 'INSERT INTO interestDetails (interest_name, interest_category_id) VALUES (?, ?)';

  database.query(addQuery, [interest_name, interest_category_id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.type("text").status(500).send("Couldn't add interest detail.");
    }
    res.type("text").status(201).send("Interest details added successfully.");
  });
});



/*
Endpoint for logging in a user. Checks to see if user is already
in the database. If not, adds user to database. 
@return: Returns the id of the user
*/
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
