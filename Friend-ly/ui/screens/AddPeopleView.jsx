/**
 * Add People to Chat Screen
 * 
 * This component provides an iMessage-style interface for adding users to an existing chat.
 * It features a searchable list of friends, visual selection feedback,
 * and the ability to add multiple friends to a conversation.
 * 
 * @module screens/AddPeopleView
 */

import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import appColors from "../common/app-colors";
import * as SecureStore from 'expo-secure-store';
import { getUserFriends, addUsersToChat } from "../mocks/backendMock";
import UserAvatar from "../components/UserAvatar";
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Component for adding people to an existing chat conversation
 * 
 * @param {Object} props - Component props
 * @param {Object} props.route - Contains route parameters
 * @param {Object} props.route.params - Parameters passed to this screen
 * @param {number} props.route.params.chatId - ID of the chat to add people to
 * @param {number[]} props.route.params.existingMembers - IDs of users already in the chat
 * @param {Object} props.navigation - React Navigation object for screen transitions
 * @returns {JSX.Element} - Rendered component
 */
const AddPeopleView = ({ route, navigation }) => {
    // Extract parameters from the route
    const { chatId, existingMembers = [] } = route.params || {};

    // State variables
    const [token, setToken] = useState(null);          // Authentication token
    const [friends, setFriends] = useState([]);        // List of available friends
    const [searchQuery, setSearchQuery] = useState(""); // Search input value
    const [selectedUsers, setSelectedUsers] = useState([]); // Selected users to add
    const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

    /**
     * Retrieves the authentication token from secure storage on component mount
     */
    useEffect(() => {
        const getToken = async () => {
            try {
                const result = await SecureStore.getItemAsync("JWT");
                result ? setToken(result) : console.log("No token found!");
            } catch (err) {
                console.error("Error retrieving authentication token:", err);
            }
        };
        getToken();
    }, []);

    /**
     * Fetches friends list and filters out users who are already in the chat
     * Also provides test data if no friends are returned from the API
     * 
     * @dependency {Array} existingMembers - List of user IDs who are already in the chat
     */
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // In a real app, use actual user ID from auth context/store
                const allFriends = await getUserFriends(1);

                // Filter out users who are already in the chat
                const availableFriends = allFriends.filter(
                    friend => !existingMembers.includes(friend.user_id)
                );

                // If no friends are returned from the API, add test friends for UI testing
                if (availableFriends.length === 0) {
                    // Sample data for testing the UI when no real data is available
                    const testFriends = [
                        { user_id: 100, username: "emma_watson", profile_picture: "https://randomuser.me/api/portraits/women/5.jpg" },
                        { user_id: 101, username: "chris_evans", profile_picture: "https://randomuser.me/api/portraits/men/8.jpg" },
                        { user_id: 102, username: "zendaya", profile_picture: "https://randomuser.me/api/portraits/women/9.jpg" },
                        { user_id: 103, username: "tom_holland", profile_picture: "https://randomuser.me/api/portraits/men/11.jpg" },
                        { user_id: 104, username: "florence_pugh", profile_picture: "https://randomuser.me/api/portraits/women/12.jpg" },
                        { user_id: 105, username: "timothee_chalamet", profile_picture: "https://randomuser.me/api/portraits/men/15.jpg" },
                        { user_id: 106, username: "robert_downey_jr", profile_picture: "https://randomuser.me/api/portraits/men/18.jpg" },
                        { user_id: 107, username: "scarlett_johansson", profile_picture: "https://randomuser.me/api/portraits/women/16.jpg" },
                    ];
                    setFriends(testFriends);
                } else {
                    setFriends(availableFriends);
                }
            } catch (err) {
                console.error("Error fetching friends:", err);

                // Add test friends even if there's an error to ensure UI is testable
                const testFriends = [
                    { user_id: 100, username: "emma_watson", profile_picture: "https://randomuser.me/api/portraits/women/5.jpg" },
                    { user_id: 101, username: "chris_evans", profile_picture: "https://randomuser.me/api/portraits/men/8.jpg" },
                    { user_id: 102, username: "zendaya", profile_picture: "https://randomuser.me/api/portraits/women/9.jpg" },
                    { user_id: 103, username: "tom_holland", profile_picture: "https://randomuser.me/api/portraits/men/11.jpg" },
                    { user_id: 104, username: "florence_pugh", profile_picture: "https://randomuser.me/api/portraits/women/12.jpg" },
                    { user_id: 105, username: "timothee_chalamet", profile_picture: "https://randomuser.me/api/portraits/men/15.jpg" }
                ];
                setFriends(testFriends);
            }
        };

        fetchFriends(); // Always fetch friends, even without token for testing
    }, [existingMembers]);

    /**
     * Updates search query state and filters friend list
     * 
     * @param {string} query - The search text entered by the user
     */
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    /**
     * Adds a user to the selected users list if not already selected
     * 
     * @param {Object} user - User object to add to selection
     * @param {number} user.user_id - Unique identifier for the user
     */
    const handleSelectUser = (user) => {
        if (!selectedUsers.some(u => u.user_id === user.user_id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    /**
     * Removes a user from the selected users list
     * 
     * @param {Object} user - User object to remove from selection
     * @param {number} user.user_id - Unique identifier for the user
     */
    const handleRemoveUser = (user) => {
        setSelectedUsers(selectedUsers.filter(u => u.user_id !== user.user_id));
    };

    /**
     * Adds selected users to the chat and creates a system notification message
     * 
     * This function:
     * 1. Collects the user IDs of selected friends
     * 2. Makes API calls to add them to the chat
     * 3. Creates a system message notifying about the additions
     * 4. Handles errors and provides user feedback
     * 5. Returns to the chat screen when complete
     * 
     * @async
     * @returns {Promise<void>}
     */
    const handleAddMembers = async () => {
        // Only proceed if users have been selected
        if (selectedUsers.length > 0) {
            try {
                // Show loading indicator while API calls are in progress
                setIsLoading(true);

                // Extract just the user IDs from the selected user objects
                const userIdsToAdd = selectedUsers.map(user => user.user_id);

                // Call the mock backend API (for development/testing)
                await addUsersToChat(chatId, userIdsToAdd);

                // Call the real backend API
                const response = await fetch("http://localhost:8000/chats/addUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        user_ids: userIdsToAdd
                    })
                });

                if (response.ok) {
                    try {
                        // Create a system message to notify users about who was added
                        // This creates a message in the chat that appears like a system notification
                        const systemMsgResponse = await fetch(`http://localhost:8000/users/${chatId}/newMessage`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                messageText: `${selectedUsers.length === 1
                                    ? `${selectedUsers[0].username.replace(/_/g, ' ')} was added to the chat`
                                    : `${selectedUsers.length} people were added to the chat`}`
                            })
                        });

                        // Non-critical error - users were added but system message failed
                        if (!systemMsgResponse.ok) {
                            console.warn("Added users but failed to create system message");
                        }
                    } catch (msgError) {
                        // Log error but continue - the main action (adding users) succeeded
                        console.warn("Added users but failed to create system message", msgError);
                    }

                    // Return to the previous screen (the chat view)
                    navigation.goBack();
                } else {
                    // Critical error - failed to add users to chat
                    console.error("Failed to add users to chat");
                    Alert.alert("Error", "Failed to add users to the chat. Please try again.");
                }
            } catch (err) {
                // Handle unexpected errors
                console.error("Error adding members to chat:", err);
                Alert.alert("Error", "Something went wrong while adding users. Please try again.");
            } finally {
                // Always hide loading indicator when done, even if there was an error
                setIsLoading(false);
            }
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Add People</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search" size={18} color="#8E8E93" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#8E8E93"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch("")} style={styles.clearButton}>
                            <View style={styles.clearButtonInner}>
                                <Text style={styles.clearButtonText}>×</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {selectedUsers.length > 0 && (
                <View style={styles.selectedUsersSection}>
                    <Text style={styles.sectionLabel}>To:</Text>
                    <ScrollView horizontal style={styles.selectedUsersContainer} showsHorizontalScrollIndicator={false}>
                        {selectedUsers.map(user => (
                            <View key={user.user_id} style={styles.selectedUserPill}>
                                <Image
                                    source={{ uri: user.profile_picture || `https://ui-avatars.com/api/?name=${user.username}&background=random` }}
                                    style={styles.selectedUserAvatar}
                                    defaultSource={require('../../assets/logo.png')}
                                />
                                <Text style={styles.selectedUserText}>
                                    {user.username.replace(/_/g, ' ')}
                                </Text>
                                <TouchableOpacity onPress={() => handleRemoveUser(user)} style={styles.removeButton}>
                                    <View style={styles.removeButtonInner}>
                                        <Text style={styles.removeUserText}>×</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
                <Text style={styles.suggestionText}>Suggestions</Text>
                {filteredFriends.length > 0 ? (
                    filteredFriends.map(friend => (
                        <TouchableOpacity
                            key={friend.user_id}
                            onPress={() => handleSelectUser(friend)}
                            style={[
                                styles.friendCard,
                                selectedUsers.some(u => u.user_id === friend.user_id) && styles.friendCardSelected
                            ]}
                        >
                            <View style={styles.friendCardContent}>
                                <Image
                                    source={{ uri: friend.profile_picture || `https://ui-avatars.com/api/?name=${friend.username}&background=random` }}
                                    style={styles.friendAvatar}
                                    defaultSource={require('../../assets/logo.png')}
                                />
                                <View style={styles.friendInfo}>
                                    <Text style={styles.friendName}>
                                        {friend.username.replace(/_/g, ' ')}
                                    </Text>
                                </View>
                                {selectedUsers.some(u => u.user_id === friend.user_id) && (
                                    <View style={styles.checkmark}>
                                        <Ionicons name="checkmark-circle" size={22} color="#007AFF" />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyStateText}>
                        {searchQuery ? "No friends match your search" : "No friends available to add"}
                    </Text>
                )}
            </ScrollView>

            <BlurView
                style={styles.buttonContainer}
                intensity={80}
                tint="light"
            >
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        selectedUsers.length === 0 && styles.disabledButton
                    ]}
                    onPress={handleAddMembers}
                    disabled={selectedUsers.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.addButtonText}>
                            {selectedUsers.length === 0 ? "Add to Chat" :
                                selectedUsers.length === 1 ? `Add ${selectedUsers[0].username.replace(/_/g, ' ')}` :
                                    `Add ${selectedUsers.length} People`}
                        </Text>
                    )}
                </TouchableOpacity>
            </BlurView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.White,
        paddingTop: 10,
    },
    header: {
        alignItems: "center",
        marginVertical: 5,
    },
    headerText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 10,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9E9EB', // iMessage search background
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 36,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#000000',
        padding: 0, // Remove default padding
    },
    clearButton: {
        padding: 4,
    },
    clearButtonInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#8E8E93',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 16,
        marginTop: -2,
    },
    selectedUsersSection: {
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9EB',
        paddingBottom: 10,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    selectedUsersContainer: {
        flexDirection: "row",
        paddingVertical: 4,
    },
    selectedUserPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#D1E5FE', // Light blue pill background like iMessage
        borderRadius: 16,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 10,
        marginRight: 8,
    },
    selectedUserAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    selectedUserText: {
        color: '#007AFF', // iMessage blue
        marginHorizontal: 6,
        fontSize: 15,
        fontWeight: '500',
    },
    removeButton: {
        marginLeft: 2,
    },
    removeButtonInner: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#C7D9F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeUserText: {
        color: '#007AFF',
        fontWeight: "bold",
        fontSize: 14,
        textAlign: 'center',
        marginTop: -2, // Visual adjustment
    },
    friendsList: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 16,
    },
    suggestionText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 16,
    },
    friendCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    friendCardSelected: {
        backgroundColor: '#F8F8F8', // Slightly gray background when selected
    },
    friendCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    friendInfo: {
        marginLeft: 12,
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
    },
    checkmark: {
        alignItems: 'flex-end',
    },
    emptyStateText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#8E8E93',
        fontSize: 16,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 34, // Extra padding for bottom safe area
        borderTopWidth: 1,
        borderTopColor: 'rgba(200, 200, 200, 0.5)',
    },
    addButton: {
        backgroundColor: '#007AFF', // iMessage blue
        padding: 14,
        borderRadius: 24,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: '#E9E9EB',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: "600",
        fontSize: 16,
    },
});

export default AddPeopleView;
