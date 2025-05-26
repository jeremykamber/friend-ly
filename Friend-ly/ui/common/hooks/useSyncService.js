// ui/common/hooks/useSyncService.js
import { useEffect, useState } from 'react';
import SyncServiceFactory from '../../services/syncService';

/**
 * Custom hook to subscribe to updates from the SyncService
 * 
 * @param {string} type - The type of updates to listen for ('messages', 'chats', 'friends', 'users')
 * @param {Object} options - Additional options
 * @param {Function} options.onUpdate - Optional callback function when updates are received
 * @param {boolean} options.autoInitialize - Whether to automatically initialize the service (default: true)
 * @returns {Object} - The current data state and control methods
 */
export function useSyncService(type, { onUpdate, autoInitialize = true } = {}) {
    const [data, setData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Get singleton instance of SyncService
    const syncService = SyncServiceFactory();

    // Setup listener for updates
    useEffect(() => {
        if (!type) return;

        // Listener callback to update local state
        const handleUpdate = (newData) => {
            setData(newData);
            if (onUpdate) onUpdate(newData);
        };

        // Register listener with syncService
        const unsubscribe = syncService.addListener(type, handleUpdate);

        // Initialize service if needed
        if (autoInitialize && !isInitialized) {
            syncService.initialize()
                .then(() => setIsInitialized(true))
                .catch(err => console.error("Error initializing sync service:", err));
        }

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [type, onUpdate, autoInitialize, isInitialized]);

    // Return data and control methods
    return {
        data,
        isInitialized,
        initialize: () => {
            syncService.initialize()
                .then(() => setIsInitialized(true))
                .catch(err => console.error("Error initializing sync service:", err));
        },
        startSync: (intervalMs) => syncService.startSync(intervalMs),
        stopSync: () => syncService.stopSync(),
        performSync: () => syncService.performSync()
    };
}

export default useSyncService;
