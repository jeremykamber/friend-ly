// Example component using the useSyncService hook
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSyncService } from '../common/hooks/useSyncService';

function ChatsListExample() {
    const { data: chats, isInitialized, performSync } = useSyncService('chats', {
        onUpdate: (newChats) => {
            console.log('Chats updated:', newChats.length);
        }
    });

    // You could still have a manual refresh function if needed
    const handleRefresh = () => {
        performSync();
    };

    if (!isInitialized) {
        return <Text>Initializing sync service...</Text>;
    }

    return (
        <View>
            <Text>Chats ({chats ? chats.length : 0})</Text>
            {chats && (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.chat_id.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.chat_name}</Text>
                            <Text>{item.message_text}</Text>
                        </View>
                    )}
                    onRefresh={handleRefresh}
                    refreshing={false}
                />
            )}
        </View>
    );
}

export default ChatsListExample;
