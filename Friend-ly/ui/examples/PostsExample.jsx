// ui/examples/PostsExample.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useSyncService } from '../common/hooks/useSyncService';
import PostCard from '../components/PostCard';

/**
 * Example component demonstrating how to use the useSyncService hook for posts
 * This shows how to synchronize posts data from the server using the sync service
 */
function PostsExample() {
    const [refreshing, setRefreshing] = useState(false);

    // Use the sync service hook to subscribe to post updates
    const { data: posts, isInitialized, performSync } = useSyncService('posts', {
        onUpdate: (newPosts) => {
            console.log('Posts updated:', newPosts?.length || 0);
        }
    });

    // Manually refresh posts when the user pulls to refresh
    const handleRefresh = () => {
        setRefreshing(true);

        performSync()
            .catch(err => console.error('Error refreshing posts:', err))
            .finally(() => setRefreshing(false));
    };

    // placeholder posts if no data is available yet
    const placeholderPosts = [
        {
            id: '1',
            username: 'sample_user',
            profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
            timestamp: '2 hours ago',
            caption: 'This is a sample post that will be replaced when real data loads.',
            likes: 15,
            comments: 3
        },
        {
            id: '2',
            username: 'another_user',
            profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
            timestamp: '5 hours ago',
            caption: 'Another sample post while waiting for server data.',
            likes: 27,
            comments: 8
        }
    ];

    // Display the posts
    const postsToDisplay = posts && posts.length > 0 ? posts : placeholderPosts;

    if (!isInitialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8a2be2" />
                <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Posts Feed</Text>
            <FlatList
                data={postsToDisplay}
                keyExtractor={(item) => item.id || Math.random().toString()}
                renderItem={({ item }) => (
                    <PostCard
                        user={{
                            username: item.username,
                            profilePic: item.profilePic,
                        }}
                        timestamp={item.timestamp}
                        image={item.image}
                        caption={item.caption}
                        likes={item.likes}
                        comments={item.comments}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#8a2be2"]}
                    />
                }
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        color: '#333',
    },
    contentContainer: {
        paddingBottom: 20,
    },
});

export default PostsExample;
