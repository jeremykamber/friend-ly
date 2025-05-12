// File: /Users/jeremy/Development/Apps/friend-ly/Friend-ly/ui/services/SyncService.js
import * as SecureStore from 'expo-secure-store';

let serviceInstance = null;

// This function creates the actual service object with its state and methods encapsulated.
function createActualSyncService() {
    let lastSyncedTimestamp = null;
    let syncInProgress = false;
    const listeners = {
        messages: [],
        chats: [],
        friends: [],
        users: []
    };
    let syncInterval = null;

    async function initialize() {
        try {
            // Load last sync timestamp from storage
            const timestamp = await SecureStore.getItemAsync("lastSyncTimestamp");
            lastSyncedTimestamp = timestamp || new Date(0).toISOString();

            // Start polling
            startSync();
        } catch (err) {
            console.error("Error initializing sync service:", err);
        }
    }

    function startSync(intervalMs = 10000) {
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
                console.error("Sync failed:", await response.text());
                return;
            }

            const { updates, serverTime } = await response.json();

            // Process updates for each entity type
            await processUpdates(updates);

            // Save new timestamp
            lastSyncedTimestamp = serverTime;
            await SecureStore.setItemAsync("lastSyncTimestamp", serverTime);

        } catch (err) {
            console.error("Sync error:", err);
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

        // Similar processing for friends and users
        // ...
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

        if (!response.ok) throw new Error("Failed to fetch messages");
        return await response.json();
    }

    async function fetchChatList() {
        // Implementation to fetch user's chat list
        // ...
        console.warn("fetchChatList is a stub and not fully implemented.");
        return []; // Placeholder
    }

    // Methods to register components as listeners
    function addListener(type, callback) {
        if (listeners[type]) {
            listeners[type].push(callback);
            return () => removeListener(type, callback); // Return an unsubscribe function
        }
    }

    function removeListener(type, callback) {
        if (listeners[type]) {
            listeners[type] = listeners[type].filter(cb => cb !== callback);
        }
    }

    function notifyListeners(type, data) {
        if (listeners[type]) {
            listeners[type].forEach(callback => callback(data));
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
        stopSync
    };
}

// Factory function to get the singleton instance of the SyncService
export default function SyncServiceFactory() {
    if (!serviceInstance) {
        serviceInstance = createActualSyncService();
    }
    return serviceInstance;
}