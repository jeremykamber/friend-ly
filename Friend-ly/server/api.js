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

// import cors
const cors = require('cors')

// importing mysql2
const mysql = require('mysql2/promise');
const { getIdToken } = require("firebase/auth");
const authMiddleware = require('./tokenMiddleware')

// env variables
require('dotenv').config()


// Middleware (Boilerplate code):

// For data sent as form-urlencoded (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// For data sent as json (application/json)
app.use(express.json());

// For data sent as a form (required for FormData use in frontend by the client)
app.use(multer().none());

// use cors
app.use(cors())

const { sendEmailVerificationEmail } = require('./functions/sendEmailVerificationEmail')


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

/**
 * Helper function to log in a user by email. If the user does not exist, creates the user.
 * Returns an object: { user_id, new_user }
 * @param {string} email
 * @param {object} database
 * @returns {Promise<{user_id: any, new_user: boolean}>}
 */
async function loginUserByEmail(email, database) {
  let newUser = false;
  const findUserQuery = "SELECT * FROM users WHERE email = ?";
  const results = await database.execute(findUserQuery, [email]);
  if (results[0].length == 0) {
    // add the user
    newUser = true;
    const profile_picture = null;
    const addUserQuery = "INSERT INTO users (bio, email, profile_picture, username) VALUES (?, ?, ?, ?)";
    await database.execute(addUserQuery, ["Hi, I am " + email, email, profile_picture, email]);
  }
  const getIDQuery = "SELECT user_id FROM users WHERE email = ?";
  const result = await database.execute(getIDQuery, [email]);
  return { user_id: result[0], new_user: newUser };
}

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
    query = 'SELECT m.chat_id, m.message_id, m.message_text, m.sent_at, u.username AS sender ' +
      'FROM messages m ' +
      'JOIN users u ON m.sender_id = u.user_id ' +
      'WHERE m.chat_id = 2 ' +
      'ORDER BY m.sent_at ASC; ';
  }
  const [results, fields] = await database.execute(query);
  return results;
}

/**
 * Checks the health of the server
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Returns back all chat history for a single chat
 */
app.get('/chats/:chat_id', async (req, res) => {
  const id = req.params.chat_id
  const [results, fields] = await database.execute(
    'SELECT * FROM messages WHERE chat_id = ? ORDER BY sent_at ASC', [id]);
  res.json(results)
});

app.get('/chats/:chat_id/users', async (req, res) => {
  const chat_id = req.params.chat_id
  const [results, fields] = await database.execute(
    'SELECT user_id FROM chatMembers WHERE chat_id = ?', [chat_id]);
  res.json(results);
})

app.get('/chats/usernames/:chat_id', async (req, res) => {
  const chat_id = req.params.chat_id
  const [results, fields] = await database.execute(
    `SELECT username FROM users ORDER BY user_id ASC`
  )
  const usernames = results.map(row => row.username)
  res.json(usernames)
})

app.get('/users/chats', authMiddleware, async (req, res) => {
  const user_id = req.user_id
  const [results, fields] = await database.execute(
    'SELECT chat_id FROM chatMembers WHERE user_id = ?', [user_id])
  res.json(results);
})




// Gets a single users information
app.post('/users/info', authMiddleware, async function (req, res) {
  let userId = req.user_id;
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
    console.log(records)
    res.json(records);
  } catch (error) {
    res.type("text").status(SERVER_ERROR_CODE)
      .send("An error occurred on the server. Try again later.");
  }
});

app.post('/users/getUserID', authMiddleware, async function (req, res) {
  res.json(req.user_id)
})

/*
  Updates the user's profile with a new username and bio. 
  Takes in a body that has a token, and a user_info body with
  a username and bio. 
*/
app.post('/users/updateInfo', authMiddleware, async function (req, res) {
  let userID = req.user_id
  let username = req.body.user_info.name
  let bio = req.body.user_info.bio
  let query = "UPDATE users SET username = ?, bio = ? WHERE user_id = ?"

  try {
    const result = await database.execute(query, [username, bio, userID])
    res.type("text").status(SUCCESS_CODE).send("Successfully updated user profile.")
  } catch (err) {
    throw (err)
  }
})

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
  console.log("inside here?")
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
app.post('/users/getLastMessageHistory', authMiddleware, async (req, res) => {
  const user_id = req.user_id
  try {
    const [results, fields] = await database.execute(
      `SELECT 
          m.chat_id, 
          m.message_text, 
          m.sent_at, 
          m.sender_id,
          u.username AS sender_name,          
          c.chat_name AS chat_name            
      FROM 
          messages m
      JOIN 
          users u ON m.sender_id = u.user_id   
      JOIN 
          chats c ON m.chat_id = c.chat_id     
      WHERE 
          m.message_id IN ( 
              SELECT MAX(sub_m.message_id) 
              FROM messages sub_m 
              GROUP BY sub_m.chat_id 
          ) 
      AND 
          m.chat_id IN ( 
              SELECT c.chat_id 
              FROM chatMembers c 
              WHERE c.user_id = ?
          ) 
      ORDER BY 
          m.sent_at DESC;`, [user_id]
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
  const query = "SELECT m.message_text FROM messages AS m WHERE m.chat_id = ? AND m.sent_at = ( SELECT MAX(m2.sent_at) FROM messages AS m2 WHERE m2.chat_id = ?);"
  const [results, fields] = await database.execute(query, [chat_id, chat_id]);
  res.json(results);
})

app.post('/users/editUName', authMiddleware, async (req, res) => {
  const user_id = req.user_id
  const new_username = req.body.username
  const query = "UPDATE users SET username = ? WHERE user_id = ?"
  const [results, fields] = await database.execute(query, [new_username, user_id])
  res.json(results)
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
      return { success: false, message: "Adding a new user failed" }
    }
  }
  return { success: true, message: "Successfully posted new users to the chat." }
}

// Above were endpoint pertaining the chatbox features. Below are endpoints
// regarding the following feature

/**
 * GET friend lists for one user
 * Select the rows that includes the user
 */
app.post('/friends/get_friends', authMiddleware, async (req, res) => {
  const user_id = req.user_id;
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
  let friends = []
  for (let i = 0; i < results.length; i++) {
    let curr_rel = results[i];
    let other_id = curr_rel["user_id1"] != user_id ? curr_rel["user_id1"] :
      curr_rel["user_id2"]
    let user_query = "SELECT * FROM users WHERE user_id = ?";
    const [friend_data, fields] = await database.execute(user_query, [other_id])
    friends.push(friend_data[0])
  }
  console.log(friends)
  res.json(friends);
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


app.post('/posts/newPost', authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const caption = req.body.caption
  const query = "INSERT INTO post (user_id, title, content) VALUES (?, ?, ?)"
  try {
    const [result] = await database.execute(query, [user_id, caption, caption])
    res.type("text").status(SUCCESS_CODE).send("Creating a new post worked!")
  } catch (err) {
    res.type("text").status(SERVER_ERROR_CODE).send("Creating a new post failed. ")
  }
})

app.post('/posts/getUserPosts', authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = "SELECT * FROM post WHERE user_id = ? ORDER BY post.created_at DESC"
  try {
    const [posts, fields] = await database.execute(query, [user_id])
    res.json(posts)
  } catch (err) {
    res.type("text").status(SERVER_ERROR_CODE).send("Fetching all posts failed. ")
  }
})

app.post('/posts/deletePost', authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const post_id = req.body.post_id
  const query = "DELETE FROM post WHERE id = ? AND user_id = ?"
  try {
    await database.execute(query, [post_id, user_id])
    res.type("text").status(SUCCESS_CODE).send("Removing post worked. ")
  } catch (err) {
    res.type("text").status(SERVER_ERROR_CODE).send("Removing post failed. ")
  }
})

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

// import
const crypto = require('crypto');

app.post('/similar-users', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.user_id;

    if (!targetUserId) {
      return res.status(400).send("User ID is required");
    }

    console.log(`Finding similar users for user ID: ${targetUserId}`);

    const [userCheck] = await database.execute(
      'SELECT COUNT(*) as count FROM userinterest WHERE user_id = ?',
      [targetUserId]
    );

    if (!userCheck[0] || userCheck[0].count === 0) {
      return res.status(404).send("User not found or has no interests");
    }

    const [userInterestRows] = await database.execute(
      'SELECT ui.user_id, i.interest_name, c.category_name ' +
      'FROM userinterest ui ' +
      'JOIN interestdetails i ON ui.interest_id = i.interest_id ' +
      'JOIN interestcategory c ON i.interest_category_id = c.interest_category_id'
    );

    const userInterests = {};
    const interestToCategory = {};

    userInterestRows.forEach(row => {
      if (!userInterests[row.user_id]) {
        userInterests[row.user_id] = [];
      }
      userInterests[row.user_id].push(row.interest_name);
      interestToCategory[row.interest_name] = row.category_name;
    });

    if (!userInterests[targetUserId] || userInterests[targetUserId].length === 0) {
      return res.status(404).send("Target user has no interests");
    }

    // LSH params
    const numHashes = 10;
    const bands = 5;
    const rowsPerBand = numHashes / bands;

    function hash(i, val) {
      return parseInt(crypto.createHash('md5').update(`${i}:${val}`).digest('hex').slice(0, 8), 16);
    }

    function minHash(interests) {
      const augmentedSet = [...interests];
      interests.forEach(interest => {
        const category = interestToCategory[interest];
        if (category) {
          augmentedSet.push(`cat:${category}`);
        }
      });

      const sig = [];
      for (let i = 0; i < numHashes; i++) {
        let min = Infinity;
        for (let val of augmentedSet) {
          min = Math.min(min, hash(i, val));
        }
        sig.push(min);
      }
      return sig;
    }

    function getBuckets(userSigs) {
      const buckets = {};
      for (let [userId, sig] of Object.entries(userSigs)) {
        for (let b = 0; b < bands; b++) {
          const band = sig.slice(b * rowsPerBand, (b + 1) * rowsPerBand).join("-");
          const key = `${b}:${band}`;
          if (!buckets[key]) buckets[key] = [];
          buckets[key].push(userId);
        }
      }
      return buckets;
    }

    function jaccard(a, b) {
      if (!a || !b || a.length === 0 || b.length === 0) return 0;
      const setA = new Set(a);
      const setB = new Set(b);
      const inter = [...setA].filter(x => setB.has(x));
      const union = new Set([...setA, ...setB]);
      return union.size > 0 ? inter.length / union.size : 0;
    }

    function calculateSimilarity(userA, userB) {
      const interestsA = userInterests[userA] || [];
      const interestsB = userInterests[userB] || [];

      const directJaccard = jaccard(interestsA, interestsB);

      const categoriesA = interestsA.map(i => interestToCategory[i]).filter(Boolean);
      const categoriesB = interestsB.map(i => interestToCategory[i]).filter(Boolean);

      const categoryJaccard = jaccard(categoriesA, categoriesB);

      const INTEREST_WEIGHT = 0.5;
      const CATEGORY_WEIGHT = 0.5;

      const score = (INTEREST_WEIGHT * directJaccard) + (CATEGORY_WEIGHT * categoryJaccard);

      return {
        score,
        interestJaccard: directJaccard,
        categoryJaccard: categoryJaccard,
        common: interestsA.filter(i => interestsB.includes(i))
      };
    }

    console.log("Building signatures...");
    const userSigs = {};
    for (const [userId, interests] of Object.entries(userInterests)) {
      userSigs[userId] = minHash(interests);
    }

    console.log("Creating LSH buckets...");
    const buckets = getBuckets(userSigs);

    console.log("Finding candidates...");
    const candidates = new Set();
    for (let b = 0; b < bands; b++) {
      const band = userSigs[targetUserId].slice(b * rowsPerBand, (b + 1) * rowsPerBand).join("-");
      const key = `${b}:${band}`;
      (buckets[key] || []).forEach(u => {
        if (u !== targetUserId && userInterests[u] && userInterests[u].length > 0) {
          candidates.add(u);
        }
      });
    }

    if (candidates.size <= 6) {
      console.log(`LSH returned only ${candidates.size} users. Adding 10 unique random users.`);

      const alreadyIncluded = new Set(candidates);
      alreadyIncluded.add(targetUserId);

      const eligibleUsers = Object.keys(userInterests).filter(u =>
        !alreadyIncluded.has(u) &&
        userInterests[u] &&
        userInterests[u].length > 0
      );

      console.log(`Found ${eligibleUsers.length} eligible users to randomly select from.`);

      let added = 0;
      while (added < 7 && eligibleUsers.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
        const randomUser = eligibleUsers.splice(randomIndex, 1)[0];
        if (!candidates.has(randomUser)) {
          candidates.add(randomUser);
          added++;
        }
      }

      console.log(`Successfully added ${added} random users. Total candidates now: ${candidates.size}`);
    }

    const results = [...candidates]
      .filter(u => parseInt(u) !== parseInt(targetUserId))
      .map(u => {
        const similarity = calculateSimilarity(targetUserId, u);
        return {
          user_id: parseInt(u),
          score: parseFloat(similarity.score.toFixed(2)),
          interest_jaccard: parseFloat(similarity.interestJaccard.toFixed(2)),
          category_jaccard: parseFloat(similarity.categoryJaccard.toFixed(2)),
          common_interests: similarity.common
        };
      })
      .sort((a, b) => b.score - a.score)

    for (let i = 0; i < results.length; i++) {
      const uid = results[i]['user_id']
      const [getUsername] = await database.execute(
        'SELECT username FROM users WHERE user_id = ?', [uid]
      )
      results[i]['username'] = getUsername[0]['username']
    }

    console.log(`Returning ${results.length} similar users`);
    res.status(200).json(results);

  } catch (err) {
    console.error("Error finding similar users:", err);
    res.status(500).send("Getting similar users failed.");
  }
});




/*
Endpoint for logging in a user. Checks to see if user is already
in the database. If not, adds user to database. 
@return: Returns the id of the user
*/
app.post('/users/login', async (req, res) => {
  const email = req.body.email;
  try {
    const loginResult = await loginUserByEmail(email, database);
    res.type("text").status(200).send(loginResult);
  } catch (err) {
    console.error('Error in /users/login:', err);
    res.type("text").status(SERVER_ERROR_CODE).send("Login failed.");
  }
});

/**
 * Endpoint to send a verification email with a code
 * Required body parameters:
 * - email: The recipient's email address
 * 
 * Optional body parameters:
 * - code: Custom verification code (if not provided, a random 6-digit code will be generated)
 */

app.post('/test', async function (req, res) {
  console.log("TESTING")
  res.type("text").status(SUCCESS_CODE).send("worked")
});

app.post('/users/sendVerificationEmail', async function (req, res) {
  try {
    const email = req.body.email;

    if (!email) {
      return res.type("text").status(USER_ERROR_CODE).send("Email address is required");
    }

    // Generate a random 6-digit code if not provided
    const verificationCode = req.body.code || Math.floor(100000 + Math.random() * 900000);

    // Store the verification code and expiration time in the database
    const expiryMinutes = 15; // Code valid for 15 minutes
    const expiresAt = new Date(Date.now() + expiryMinutes * 60000);
    try {
      // Remove any existing verification codes for this email
      await database.execute(
        'DELETE FROM verification_codes WHERE email = ?',
        [email]
      );


      // Insert the new verification code
      await database.execute(
        'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
        [email, verificationCode, expiresAt]
      );
    } catch (dbError) {
      console.error('Database error storing verification code:', dbError);
      return res.type("text").status(SERVER_ERROR_CODE)
        .send("Failed to store verification code");
    }

    // Send the email with the verification code
    await sendEmailVerificationEmail(verificationCode, email);

    res.type("text").status(SUCCESS_CODE)
      .send("Verification email sent successfully");

  } catch (error) {
    console.error('Error sending verification email:', error);
    res.type("text").status(SERVER_ERROR_CODE)
      .send("Failed to send verification email");
  }
});

/**
 * Endpoint to resend a verification email with a new code
 * Required body parameters:
 * - email: The recipient's email address
 */
app.post('/users/resendVerificationEmail', async function (req, res) {
  try {
    const email = req.body.email;

    if (!email) {
      return res.type("text").status(USER_ERROR_CODE).send("Email address is required");
    }

    // Generate a new random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Store the verification code and expiration time in the database
    const expiryMinutes = 15; // Code valid for 15 minutes
    const expiresAt = new Date(Date.now() + expiryMinutes * 60000);
    try {
      // Remove any existing verification codes for this email
      await database.execute(
        'DELETE FROM verification_codes WHERE email = ?',
        [email]
      );

      // Insert the new verification code
      await database.execute(
        'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
        [email, verificationCode, expiresAt]
      );
    } catch (dbError) {
      console.error('Database error storing verification code:', dbError);
      return res.type("text").status(SERVER_ERROR_CODE)
        .send("Failed to store verification code");
    }

    // Send the email with the verification code
    await sendEmailVerificationEmail(verificationCode, email);

    res.type("text").status(SUCCESS_CODE)
      .send("Verification email resent successfully");

  } catch (error) {
    console.error('Error resending verification email:', error);
    res.type("text").status(SERVER_ERROR_CODE)
      .send("Failed to resend verification email");
  }
});

/**
 * Endpoint to verify an email verification code
 * Required body parameters:
 * - email: The email address to verify
 * - code: The verification code to check
 */
app.post('/users/verifyEmailCode', async function (req, res) {
  try {
    console.log("Verifying email code");
    const { email, code } = req.body;

    console.log("Attempting to verify email code for email:", email);

    if (!email || !code) {
      console.log("Email or code missing in request body");
      return res.type("text").status(USER_ERROR_CODE)
        .send("Email and verification code are required");
    }

    console.log("Checking if the code exists and is valid for email:", email);

    // Log the codes for verification
    console.log("Code from request:", code);

    // Check if the code exists and is valid
    const [rows] = await database.execute(
      'SELECT * FROM verification_codes WHERE email = ? AND code = ?',
      [email, code]
    );

    if (rows.length === 0) {
      console.log("Invalid or expired verification code for email:", email);
      return res.type("text").status(USER_ERROR_CODE)
        .send("Invalid or expired verification code");
    }

    console.log("Verification code is valid for email:", email);

    // Code is valid - you can update user status here if needed
    // For example, set email_verified = true in your users table

    console.log("Removing the used verification code for email:", email);

    // Remove the used verification code
    await database.execute(
      'DELETE FROM verification_codes WHERE email = ?',
      [email]
    );

    console.log("Successfully removed verification code for email:", email);

    // No need to log in the user here; this is handled in /api/auth (authUser)
    // Just return a success response
    return res.type("text").status(200).send({ success: true, message: "Email verified." });

  } catch (error) {
    console.error('Error verifying email code:', error);
    res.type("text").status(SERVER_ERROR_CODE)
      .send("Failed to verify email code");
  }
});

// Get updates since a specific timestamp for a user
// Returns minimal info about what's changed so client knows what to refresh
app.get('/users/updates', authMiddleware, async function (req, res) {
  const userId = req.user_id;
  const lastSynced = req.query.lastSynced;

  try {
    // Get updates relevant to this user since lastSynced
    const [results] = await database.execute(
      `SELECT entity_type, entity_id, chat_id, updated_at, action_type 
       FROM updates 
       WHERE (user_id = ? OR user_id IS NULL) 
         AND updated_at > ? 
       ORDER BY updated_at ASC`,
      [userId, lastSynced]
    );

    // Group updates by entity type for easier client-side processing
    const groupedUpdates = {
      messages: [],
      chats: [],
      friends: [],
      users: [],
      // TODO: Add other types as needed
    };

    // add all the updates to the groupedUpdates object
    results.forEach(update => {
      if (groupedUpdates[update.entity_type + 's']) {
        groupedUpdates[update.entity_type + 's'].push({
          id: update.entity_id,
          chatId: update.chat_id,
          action: update.action_type,
          timestamp: update.updated_at
        });
      }
    });

    res.json({
      updates: groupedUpdates,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching updates:", error);
    // Always send a valid response structure on error
    res.status(500).json({
      updates: {
        messages: [],
        chats: [],
        friends: [],
        users: []
      },
      serverTime: new Date().toISOString()
    });
  }
});

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
