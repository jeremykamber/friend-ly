# Using SyncService in Friend-ly App Components

This guide explains how to use the SyncService in different components of the Friend-ly app to synchronize data with the server efficiently.

## What is SyncService?

The SyncService is a centralized data synchronization solution that:

1. Automatically polls the server for updates at regular intervals
2. Filters and processes different types of updates (messages, chats, friends, etc.)
3. Notifies components when relevant data changes
4. Handles error conditions and connectivity issues
5. Provides manual sync capabilities when needed

## Quick Start

### Step 1: Wrap your app with AppSyncProvider

This is already done in `App.js`, but for reference:

```jsx
import { AppSyncProvider } from './ui/common/providers/AppSyncProvider';

const App = () => {
  return (
    <AppSyncProvider>
      <NavigationContainer>
        {/* Rest of your app */}
      </NavigationContainer>
    </AppSyncProvider>
  );
};
```

### Step 2: Use the hook in your component

```jsx
import { useSyncService } from '../common/hooks/useSyncService';

function MyComponent() {
  // Subscribe to updates for a specific data type
  const { data, isInitialized, performSync } = useSyncService('chats', {
    onUpdate: (newData) => {
      console.log('New data received:', newData);
      // Process the updated data as needed
    }
  });
  
  // You can use the data directly in your rendering
  return (
    <View>
      {data ? (
        <Text>Data loaded: {data.length} items</Text>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button title="Refresh" onPress={performSync} />
    </View>
  );
}
```

## Available Entity Types

The SyncService supports the following entity types:

- `messages` - Chat messages for a specific conversation
- `chats` - List of chat conversations
- `friends` - User's friend list
- `users` - User profile information
- `posts` - User posts
- `interests` - User interests
- `classes` - User classes

## Hook API

The `useSyncService` hook returns an object with these properties:

- `data` - The current data for the requested entity type
- `isInitialized` - Boolean indicating if the sync service has been initialized
- `initialize()` - Method to manually initialize the service
- `startSync(intervalMs)` - Start automatic sync with specified interval
- `stopSync()` - Stop automatic syncing
- `performSync()` - Manually trigger a sync operation

## Examples

### 1. Chat Messages Example

```jsx
const ChatMessagesView = ({ route }) => {
  const { chatId } = route.params;
  
  const { data: messageUpdates } = useSyncService('messages', {
    onUpdate: (data) => {
      if (data && data.chatId === chatId) {
        setMessages(data.messages);
      }
    }
  });
  
  // Rest of component...
};
```

### 2. Chats List Example

```jsx
const ChatsView = () => {
  const [lastMessages, setLastMessages] = useState([]);
  
  const { data: chatUpdates } = useSyncService('chats', {
    onUpdate: (newData) => {
      if (newData && Array.isArray(newData)) {
        setLastMessages(newData);
      }
    }
  });
  
  // Rest of component...
};
```

### 3. Manual Refresh Example

```jsx
const ProfileView = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: userData, performSync } = useSyncService('users');
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await performSync();
    setIsRefreshing(false);
  };
  
  return (
    <ScrollView 
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Profile content */}
    </ScrollView>
  );
};
```

## Best Practices

1. **Specify the correct entity type** - Use the entity type that matches the data you need.

2. **Handle loading states** - Use the `isInitialized` property to show loading indicators.

3. **Process updates in the onUpdate callback** - This helps separate the update logic from rendering.

4. **Filter data in the callback** - If you only need a subset of the data, filter it in the callback.

5. **Clean up is automatic** - The hook automatically unsubscribes from updates when the component unmounts.

6. **Combine with local state** - Use the sync service for server data and local state for UI-specific state.

7. **Manual refresh for user actions** - Use `performSync()` for pull-to-refresh and other user-initiated updates.

## Advanced Usage

### Working with Multiple Entity Types

If your component needs data from multiple entity types, you can use multiple hooks:

```jsx
function ComplexView() {
  const { data: chats } = useSyncService('chats');
  const { data: friends } = useSyncService('friends');
  
  // Use both data sources in your component
}
```

### Offline Support

The sync service automatically handles offline states and will retry when connectivity is restored.

### Custom Sync Intervals

You can customize the sync interval for specific screens:

```jsx
function ActiveChatView() {
  const { startSync, stopSync } = useSyncService('messages');
  
  useEffect(() => {
    // More frequent updates for active chats
    startSync(1000); // 1 second interval
    
    return () => stopSync(); // Stop when component unmounts
  }, []);
}
```

## Troubleshooting

1. **No data updates** - Check that you're using the correct entity type and that the server API is returning data.

2. **Too many updates** - Consider using a more selective update strategy or debouncing updates.

3. **Performance issues** - Make sure you're not syncing too frequently or processing large datasets inefficiently.

4. **Data not persisting** - The sync service doesn't handle persistence; use AsyncStorage or SecureStore if needed.

## Further Development

Areas for future improvement:

1. Add WebSocket support for real-time updates
2. Implement data persistence for offline use
3. Add conflict resolution for simultaneous updates
4. Extend retry mechanism with exponential backoff
5. Add support for pagination of large datasets
