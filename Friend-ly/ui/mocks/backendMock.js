/**
 * Mock API service
 * This provides simulated responses for backend endpoints
 * to use during frontend development.
 */

// Simulated delay to mimic network requests (in ms)
const DELAY = 300;

// Mock user data
const mockUsers = {
    1: { user_id: 1, username: 'john_doe', email: 'john@example.com', profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg' },
    2: { user_id: 2, username: 'jane_smith', email: 'jane@example.com', profile_picture: 'https://randomuser.me/api/portraits/women/2.jpg' },
    3: { user_id: 3, username: 'alex_wong', email: 'alex@example.com', profile_picture: 'https://randomuser.me/api/portraits/men/3.jpg' },
    4: { user_id: 4, username: 'sarah_parker', email: 'sarah@example.com', profile_picture: 'https://randomuser.me/api/portraits/women/4.jpg' }
};

// Mock chats data
const mockChats = {
    1: { chat_id: 1, chat_name: 'Friends Group', profile_picture: 'https://picsum.photos/200' },
    2: { chat_id: 2, chat_name: 'Work Team', profile_picture: 'https://picsum.photos/200' }
};

// Mock chat members
const mockChatMembers = {
    1: [1, 2, 3],  // chat_id 1 has users 1, 2, and 3
    2: [1, 4]      // chat_id 2 has users 1 and 4
};

// Mock messages
const mockMessages = {
    1: [
        { message_id: 1, chat_id: 1, sender_id: 1, message_text: 'Hey everyone!', sent_at: '2024-02-25T10:00:00Z', username: 'john_doe' },
        { message_id: 2, chat_id: 1, sender_id: 2, message_text: 'Hi John!', sent_at: '2024-02-25T10:01:00Z', username: 'jane_smith' },
        { message_id: 3, chat_id: 1, sender_id: 3, message_text: 'What\'s up?', sent_at: '2024-02-25T10:02:00Z', username: 'alex_wong' }
    ],
    2: [
        { message_id: 4, chat_id: 2, sender_id: 1, message_text: 'Meeting at 3pm?', sent_at: '2024-02-26T09:00:00Z', username: 'john_doe' },
        { message_id: 5, chat_id: 2, sender_id: 4, message_text: 'Yes, I\'ll be there', sent_at: '2024-02-26T09:05:00Z', username: 'sarah_parker' }
    ]
};

// Mock friendship statuses
const mockFriendships = [
    { friend1: 1, friend2: 2, accepted: true },
    { friend1: 1, friend2: 3, accepted: true },
    { friend1: 1, friend2: 4, accepted: false } // Pending request
];

// Helper function to simulate API delay
const simulateDelay = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), DELAY);
    });
};

/**
 * Get chat history for a specific chat
 * @param {number} chatId - The ID of the chat
 * @returns {Promise} - Chat messages
 */
export const getChatHistory = (chatId) => {
    return simulateDelay(mockMessages[chatId] || []);
};

/**
 * Get users in a specific chat
 * @param {number} chatId - The ID of the chat
 * @returns {Promise} - Array of user IDs
 */
export const getChatUsers = (chatId) => {
    const userIds = mockChatMembers[chatId] || [];
    const users = userIds.map(id => ({ user_id: id }));
    return simulateDelay(users);
};

/**
 * Get user information by ID
 * @param {number} userId - The user ID
 * @returns {Promise} - User information
 */
export const getUserInfo = (userId) => {
    return simulateDelay([mockUsers[userId] || null]);
};

/**
 * Update message seen status
 * @param {boolean} value - Seen status that message will be updated to
 * @param {number} messageId - ID of the message that was seen
 * @param {number} userId - ID of the user who saw the message
 * @param {number} chatId - ID of the chat where the message is
 * @returns {Promise} - Success message
 */
export const updateMessageSeen = (value, messageId, userId, chatId) => {
    mockMessages[chatId] = (mockMessages[chatId] || []).map(message => {
        if (message.message_id === messageId) {
            message.seen = value; // assuming value is t/f
        }
        return message;
    });
    return simulateDelay("Successfully set the most recent message for specified user");
};

/**
 * Post a new message to a chat
 * @param {number} userId - ID of the sender
 * @param {number} chatId - ID of the chat
 * @param {string} messageText - Message content
 * @returns {Promise} - Success message
 */
export const postNewMessage = (userId, chatId, messageText) => {
    const newMessageId = Math.max(
        ...Object.values(mockMessages)  // Get arrays of messages from each chat
            .flat()                       // Flatten into single array of all messages
            .map(m => m.message_id)       // Extract just the message IDs
    ) + 1;

    const newMessage = {
        message_id: newMessageId,
        chat_id: chatId,
        sender_id: userId,
        message_text: messageText,
        sent_at: new Date().toISOString(),
        username: mockUsers[userId]?.username
    };

    mockMessages[chatId] = [...(mockMessages[chatId] || []), newMessage]; // update mock messages
    return simulateDelay(newMessage);
};

/**
 * Create a new conversation
 * @param {string} chatName - Name of the chat
 * @param {string} profilePic - URL of the chat profile picture
 * @param {number[]} userIds - Array of user IDs to add to the chat
 * @returns {Promise} - Success message
 */
export const createNewConversation = (chatName, profilePic, userIds) => {
    let mockChatLength = Object.keys(mockChats).length;
    mockChats[mockChatLength + 1] = { chat_id: mockChatLength + 1, chat_name: chatName, profile_picture: profilePic }; // create new chat in mockChats
    mockChatMembers[mockChatLength + 1] = userIds; // add users to chatMembers table

    return simulateDelay("Successfully posted a new chat in chats table and chatMembers table");
};

/**
 * Get last message from each chat for a user
 * @param {number} userId - ID of the user
 * @returns {Promise} - Array of last messages from each chat
 */
export const getLastMessageHistory = (userId) => {
    const lastMessages = Object.keys(mockChatMembers)
        .filter(chatId => mockChatMembers[chatId].includes(userId)) // finds chats that user is in
        .map(chatId => {
            const messages = mockMessages[chatId] || [];
            return messages[messages.length - 1]; // gets the last message from each chat
        })
        .filter(message => message); // gets those messages out of the iterable

    return simulateDelay(lastMessages);
};

/**
 * Add users to a chat
 * @param {number} chatId - ID of the chat
 * @param {number[]} userIds - Array of user IDs to add
 * @returns {Promise} - Success message
 */
export const addUsersToChat = (chatId, userIds) => {
    mockChatMembers[chatId] = [...(mockChatMembers[chatId] || []), ...userIds]; // add users to chatMembers table
    return simulateDelay("Successfully posted new users to the chat.");
};

/**
 * Send a friend request
 * @param {number} userId1 - ID of the user sending the request
 * @param {number} userId2 - ID of the user receiving the request
 * @returns {Promise} - Success message
 */
export const sendFriendRequest = (userId1, userId2) => {
    mockFriendships.push({ friend1: userId1, friend2: userId2, accepted: false });
    return simulateDelay("Successfully made the relationship");
};

/**
 * 
 * @param {number} userId1 - ID of the user accepting the request
 * @param {number} userId2 - ID of the friend who sent the request
 * @returns {Promise} - Success message
 */

export const acceptFriendRequest = (userId1, userId2) => {
    const friendship = mockFriendships.find(f => f.friend1 === userId1 && f.friend2 === userId2);
    friendship.accepted = true;
    return simulateDelay("Successfully accepted the friend request");
}

export const getUserFriends = (userId) => {
    const friends = mockFriendships
        .filter(f => (f.friend1 === userId || f.friend2 === userId) && f.accepted)
        .map(f => f.friend1 === userId ? f.friend2 : f.friend1);

    return simulateDelay(friends ?? []);
}

/**
 * Login user
 * @param {string} email - User's email address
 * @returns {Promise} - User data or registration prompt
 */
export const loginUser = (email) => {
    // Find user by email in mockUsers database
    const user = Object.values(mockUsers)
        .find(user => user.email === email);

    // Return user if found, otherwise return registration prompt
    return simulateDelay(user || { needsRegistration: true });
};

export default {
    getChatHistory,
    getChatUsers,
    getUserInfo,
    updateMessageSeen,
    postNewMessage,
    createNewConversation,
    getLastMessageHistory,
    addUsersToChat,
    sendFriendRequest,
    acceptFriendRequest,
    getUserFriends,
    loginUser
};
