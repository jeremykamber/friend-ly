// ui/common/providers/AppSyncProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import SyncServiceFactory from '../../services/syncService';
import * as SecureStore from 'expo-secure-store';

// Create context
const SyncContext = createContext(null);

/**
 * Provider component that initializes and manages the SyncService
 * Place this high in your component tree to ensure app-wide sync functionality
 */
export function AppSyncProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const syncService = SyncServiceFactory();

    // Initialize the service and check for auth token
    useEffect(() => {
        const checkAuthAndInitialize = async () => {
            try {
                const token = await SecureStore.getItemAsync("JWT");
                const hasAuth = !!token;
                setIsAuthenticated(hasAuth);

                if (hasAuth && !isInitialized) {
                    await syncService.initialize();
                    setIsInitialized(true);
                    console.log("SyncService initialized successfully");
                }
            } catch (err) {
                console.error("Error initializing AppSyncProvider:", err);
            }
        };

        checkAuthAndInitialize();
    }, [isInitialized]);

    // Provide the sync service and state to consumers
    const value = {
        syncService,
        isAuthenticated,
        isInitialized
    };

    return (
        <SyncContext.Provider value={value}>
            {children}
        </SyncContext.Provider>
    );
}

/**
 * Hook to use the sync context
 */
export function useSyncContext() {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error("useSyncContext must be used within an AppSyncProvider");
    }
    return context;
}

export default AppSyncProvider;
