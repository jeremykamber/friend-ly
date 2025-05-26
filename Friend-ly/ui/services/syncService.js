
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

let serviceInstance = null;

// This function creates the actual service object with its state and methods encapsulated.
function createActualSyncService() {
    let lastSyncedTimestamp = null;
    let syncInProgress = false;
    const listeners = {
        messages: [],
        chats: [],
        friends: [],
        users: [],
        posts: [],      // Added posts entity type
        interests: [],  // Added interests entity type
        classes: []     // Added classes entity type
    };
    let syncInterval = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 5000; // 5 seconds between retries
    let isOnline = true; // Track online/offline status

    // Check network connectivity (simplified version)
    function checkConnectivity() {
        return fetch('http://localhost:8000/health', { method: 'GET' })
            .then(() => {
                if (!isOnline) {
                    console.log('Connection restored');
                    isOnline = true;
                }
                return true;
            })
            .catch(() => {
                if (isOnline) {
                    console.log('Connection lost');
                    isOnline = false;
                }
                return false;
            });
    }

    async function initialize() {
        try {
            // Load last sync timestamp from storage
            const timestamp = await SecureStore.getItemAsync("lastSyncTimestamp");
            lastSyncedTimestamp = timestamp || new Date(0).toISOString();

            // Start polling
            startSync();
            return true;
        } catch (err) {
            console.error("Error initializing sync service:", err);
            return false;
        }
    }

    function startSync(intervalMs = 3000) {
        // Clear any existing interval
        if (syncInterval) {
            clearInterval(syncInterval);
        }

        // Set up recurring sync
        syncInterval = setInterval(() => performSync(), intervalMs);

        // Also sync immediately
        performSync();
    }

    async function performSync() {
        if (syncInProgress) return;

        try {
            syncInProgress = true;
            
            // Check if we're online before attempting sync
            const online = await checkConnectivity();
            if (!online) {
                console.log('Skipping sync - device appears to be offline');
                setTimeout(() => performSync(), RETRY_DELAY_MS); // Try again after delay
                return;
            }
            
            const token = await SecureStore.getItemAsync("JWT");

            if (!token) {
                console.log("No auth token found, skipping sync");
                return;
            }

            // Fetch updates since last sync
            const response = await fetch(`http://localhost:8000/users/updates?lastSynced=${lastSyncedTimestamp}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${await response.text()}`);
            }



            // Defensive: always provide a fallback for updates
            const parsed = await response.json();
            const updates = parsed && parsed.updates ? parsed.updates : { messages: [], chats: [], friends: [], users: [] };
            const serverTime = parsed && parsed.serverTime ? parsed.serverTime : new Date().toISOString();

            // Log sync success and what changed
            console.log('[SyncService] Sync successful at', serverTime);
            const changedTypes = Object.keys(updates).filter(type => Array.isArray(updates[type]) && updates[type].length > 0);
            if (changedTypes.length === 0) {
                console.log('[SyncService] No changes detected.');
            } else {
                changedTypes.forEach(type => {
                    const items = updates[type];
                    const ids = items.map(item => item.id || item.chatId || item.user_id || item.message_id || '[unknown id]');
                    console.log(`[SyncService] ${type} changed: count=${items.length}, ids=${JSON.stringify(ids)}`);
                });
            }

            // Process updates for each entity type
            await processUpdates(updates);

            // Save new timestamp
            lastSyncedTimestamp = serverTime;
            await SecureStore.setItemAsync("lastSyncTimestamp", serverTime);

            // Reset retry counter on success
            retryCount = 0;

        } catch (err) {
            console.error("Sync error:", err);
            
            // Implement retry logic
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.log(`Sync failed, retrying (${retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY_MS}ms`);
                setTimeout(() => performSync(), RETRY_DELAY_MS);
            } else {
                // Notify the user of sync issues if we've tried several times
                // Only show this in development or if it's a critical issue
                console.error('Multiple sync attempts failed');
                // In production, you might want to be more selective about which errors trigger alerts
                // Alert.alert('Sync Error', 'Unable to synchronize with the server. Please try again later.');
                
                // Reset retry counter after notifying
                retryCount = 0;
            }
        } finally {
            syncInProgress = false;
        }
    }

    async function processUpdates(updates) {
        // Process message updates
        if (updates.messages && updates.messages.length > 0) {
            const chatIds = [...new Set(updates.messages.map(m => m.chatId))];

            // Fetch updated messages for affected chats
            for (const chatId of chatIds) {
                try {
                    const messages = await fetchChatMessages(chatId);
                    // Notify all message listeners for this chat
                    notifyListeners('messages', { chatId, messages });
                } catch (err) {
                    console.error(`Error fetching messages for chat ${chatId}:`, err);
                }
            }
        }

        // Process chat updates (new chats or updated chats)
        if (updates.chats && updates.chats.length > 0) {
            try {
                const chatList = await fetchChatList();
                notifyListeners('chats', chatList);
            } catch (err) {
                console.error("Error fetching chat list:", err);
            }
        }

        // Process friend updates
        if (updates.friends && updates.friends.length > 0) {
            try {
                const friendList = await fetchFriendList();
                notifyListeners('friends', friendList);
            } catch (err) {
                console.error("Error fetching friend list:", err);
            }
        }

        // Process user updates
        if (updates.users && updates.users.length > 0) {
            try {
                const userUpdates = [];
                for (const update of updates.users) {
                    const userData = await fetchUserData(update.id);
                    userUpdates.push(userData);
                }
                notifyListeners('users', userUpdates);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        }
        
        // Process post updates
        if (updates.posts && updates.posts.length > 0) {
            try {
                const postData = await fetchPosts();
                notifyListeners('posts', postData);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        }
        
        // Process interests updates
        if (updates.interests && updates.interests.length > 0) {
            try {
                const interestsData = await fetchInterests();
                notifyListeners('interests', interestsData);
            } catch (err) {
                console.error("Error fetching interests:", err);
            }
        }
        
        // Process classes updates
        if (updates.classes && updates.classes.length > 0) {
            try {
                const classesData = await fetchClasses();
                notifyListeners('classes', classesData);
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        }
    }

    // Helper methods to fetch specific data
    async function fetchChatMessages(chatId) {
        const token = await SecureStore.getItemAsync("JWT");
        const response = await fetch(`http://localhost:8000/chats/${chatId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`);
        return await response.json();
    }

    async function fetchChatList() {
        const token = await SecureStore.getItemAsync("JWT");
        const response = await fetch("http://localhost:8000/users/getLastMessageHistory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token })
        });
        
        if (!response.ok) throw new Error(`Failed to fetch chat list: ${response.status}`);
        return await response.json();
    }
    
    async function fetchFriendList() {
        const token = await SecureStore.getItemAsync("JWT");
        const response = await fetch("http://localhost:8000/friends/get_friends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token })
        });
        
        if (!response.ok) throw new Error(`Failed to fetch friend list: ${response.status}`);
        return await response.json();
    }
    
    async function fetchUserData(userId) {
        const token = await SecureStore.getItemAsync("JWT");
        // For now, just return the user ID - implement actual fetch as needed
        return { user_id: userId, updated: true };
    }
    
    async function fetchPosts() {
        const token = await SecureStore.getItemAsync("JWT");
        // Implement actual API call when available
        return [];
    }
    
    async function fetchInterests() {
        const token = await SecureStore.getItemAsync("JWT");
        // Implement actual API call when available
        return [];
    }
    
    async function fetchClasses() {
        const token = await SecureStore.getItemAsync("JWT");
        // Implement actual API call when available
        return [];
    }

    // Methods to register components as listeners
    function addListener(type, callback) {
        if (listeners[type]) {
            listeners[type].push(callback);
            return () => removeListener(type, callback); // Return an unsubscribe function
        }
        return () => {}; // Return no-op if type isn't valid
    }

    function removeListener(type, callback) {
        if (listeners[type]) {
            listeners[type] = listeners[type].filter(cb => cb !== callback);
        }
    }

    function notifyListeners(type, data) {
        if (listeners[type]) {
            listeners[type].forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`Error in ${type} listener:`, err);
                }
            });
        }
    }

    // Clean up method
    function stopSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
        }
    }

    // Expose public methods
    return {
        initialize,
        startSync,
        performSync,
        addListener,
        removeListener,
        stopSync,
        isOnline: () => isOnline
    };
}

// Factory function to get the singleton instance of the SyncService
export default function SyncServiceFactory() {
    if (!serviceInstance) {
        serviceInstance = createActualSyncService();
    }
    return serviceInstance;
}
