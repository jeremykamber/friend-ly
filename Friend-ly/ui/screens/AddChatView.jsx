/**
 * Create New Chat Screen
 * 
 * This component provides an iMessage-style interface for creating new chat conversations.
 * It allows users to select friends from a searchable list, create 1:1 or group chats,
 * name group conversations, and provides visual feedback during the process.
 * 
 * @module screens/AddChatView
 */

import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import appColors from "../common/app-colors";
import * as SecureStore from 'expo-secure-store';
import { getUserFriends, createNewConversation } from "../mocks/backendMock";
import UserAvatar from "../components/UserAvatar";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

/**
 * Component for creating new chat conversations
 * 
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen transitions
 * @returns {JSX.Element} - Rendered component
 */
const AddChatView = ({ navigation }) => {
	// State variables
	const [token, setToken] = useState(null);          // Authentication token
	const [friends, setFriends] = useState([]);        // List of available friends
	const [searchQuery, setSearchQuery] = useState(""); // Search input value
	const [selectedUsers, setSelectedUsers] = useState([]); // Selected users for the chat
	const [chatTitle, setChatTitle] = useState("");    // Title for group chats
	const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
	const [currentUserId, setCurrentUserId] = useState(1); // Current user ID (hardcoded for demo)
	const [filteredFriends, setFilteredFriends] = useState([])

	/**
	 * Retrieves the authentication token from secure storage on component mount
	 * Also sets a default user ID for development purposes
	 */
	useEffect(() => {
		const getToken = async () => {
			try {
				const result = await SecureStore.getItemAsync("JWT");
				if (!result) {
					console.log("No token found");
					return
				}
				setToken(result)
				const getFriends = await fetch("http://localhost:8000/friends/get_friends", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token: result })
				})
				if (getFriends.ok) {
					const friends = await getFriends.json()
					setFriends(friends)
					setFilteredFriends(friends)
				}
				

				// In a real app, we'd get the current user ID from a proper auth context
				// For now, we'll use a hardcoded value
				setCurrentUserId(1);
			} catch (err) {
				console.error("Error retrieving authentication token:", err);
			}
		};
		getToken();
	}, []);

	/**
	 * Fetches the user's friends list from the API
	 * Provides test data if no friends are returned or if an error occurs
	 * 
	 * @dependency {number} currentUserId - The ID of the current user
	 */
	useEffect(() => {
		const fetchFriends = async () => {
			try {
				// Attempt to fetch friends from the API using the current user ID
				const fetchedFriends = await getUserFriends(currentUserId);

				// If no friends are returned from the API, add test friends for UI testing
				if (!fetchedFriends || fetchedFriends.length === 0) {
					// Sample celebrity data for testing the UI when no real data is available
					const testFriends = [
						{ user_id: 100, username: "emma_watson", profile_picture: "https://randomuser.me/api/portraits/women/5.jpg" },
						{ user_id: 101, username: "chris_evans", profile_picture: "https://randomuser.me/api/portraits/men/8.jpg" },
						{ user_id: 102, username: "zendaya", profile_picture: "https://randomuser.me/api/portraits/women/9.jpg" },
						{ user_id: 103, username: "tom_holland", profile_picture: "https://randomuser.me/api/portraits/men/11.jpg" },
						{ user_id: 104, username: "florence_pugh", profile_picture: "https://randomuser.me/api/portraits/women/12.jpg" },
						{ user_id: 105, username: "timothee_chalamet", profile_picture: "https://randomuser.me/api/portraits/men/15.jpg" },
						{ user_id: 106, username: "robert_downey_jr", profile_picture: "https://randomuser.me/api/portraits/men/18.jpg" },
						{ user_id: 107, username: "scarlett_johansson", profile_picture: "https://randomuser.me/api/portraits/women/16.jpg" }
					];
					//setFriends(testFriends);
				} else {
					//setFriends(fetchedFriends);
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
				//setFriends(testFriends);
			}
		};

		fetchFriends(); // Always fetch friends, even without token for testing
	}, [currentUserId]);

	/**
	 * Updates search query state and filters friend list
	 * 
	 * @param {string} query - The search text entered by the user
	 */
	const handleSearch = (query) => {
		console.log("Friends: " + friends)
		setFilteredFriends(friends.filter(friend =>
			friend["username"].toLowerCase().includes(query.toLowerCase())))
		setSearchQuery(query)
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

	// Determine if this is a group chat (more than 1 selected user)
	const isGroupChat = selectedUsers.length > 1;

	/**
	 * Validates if the chat title meets requirements based on chat type
	 * For group chats, a title is required; for 1:1 chats, it's optional
	 * 
	 * @returns {boolean} True if the title is valid for the current chat type
	 */
	const isTitleValid = () => {
		if (isGroupChat) {
			// For group chats, require a title
			return chatTitle.trim().length > 0;
		}
		// For 1:1 chats, title is optional
		return true;
	};

	/**
	 * Creates a new chat conversation with selected users
	 * 
	 * This function:
	 * 1. Validates that users have been selected and required fields are completed
	 * 2. Determines an appropriate chat name based on chat type (group vs 1:1)
	 * 3. Makes API calls to create the conversation
	 * 4. Creates a system message for group chats
	 * 5. Handles errors and provides user feedback
	 * 6. Navigates to the appropriate screen upon completion
	 * 
	 * @async
	 * @returns {Promise<void>}
	 */
	const handleCreateChat = async () => {
		// Validate that at least one user is selected
		if (selectedUsers.length === 0) {
			Alert.alert("Error", "Please select at least one user to chat with");
			return;
		}

		// For group chats, require a title
		if (isGroupChat && !isTitleValid()) {
			Alert.alert("Error", "Please enter a name for this group chat");
			return;
		}

		try {
			// Show loading indicator while API calls are in progress
			setIsLoading(true);

			// Determine the appropriate chat name
			// For 1:1 chats, use the friend's username if no custom title is provided
			// For group chats, use the provided group name
			const finalChatName = isGroupChat
				? chatTitle
				: (chatTitle.trim() || selectedUsers[0].username);

			// Combine selected user IDs with current user ID for the chat members
			const userIds = [...selectedUsers.map(user => user.user_id), currentUserId];

			// Call the mock backend API for development/testing environment
			//await createNewConversation(finalChatName, null, userIds);

			// Call the real backend API
			const response = await fetch("http://localhost:8000/chats/newConversation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: token,
					chat_name: finalChatName,
					user_ids: selectedUsers.map(user => user.user_id),
					profile_pic: null
				})
			});

			if (response.ok) {
				// Extract chat ID from the response if available
				const responseData = await response.json().catch(() => ({}));
				console.log("Data: " + responseData)
				const newChatId = responseData.chat_id;

				// For group chats, create a system message notifying about the creation
				if (newChatId) {
					try {
						// Create a system message to notify members about the new group
						const systemMsgResponse = await fetch(`http://localhost:8000/users/${newChatId}/newMessage`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								token: token,
								messageText: !isGroupChat ? `New Message with ${selectedUsers[0].username}` 
									: (finalChatName ? `Group "${finalChatName}" created`
									: `Group chat created with ${selectedUsers.length} members`)
							})
						});

						// Non-critical error - chat was created but system message failed
						if (!systemMsgResponse.ok) {
							console.warn("Chat created but failed to add system message");
						}
					} catch (msgError) {
						// Log error but continue - the main action (creating chat) succeeded
						console.warn("Chat created but failed to add system message", msgError);
						// Continue - we still want to navigate to the new chat even if the system message fails
					}
				}

				// Navigate back to chat list or directly to the new chat
				// Option 1: Go back to chat list
				navigation.navigate('ChatsMain');

				// Option 2: Navigate directly to the new chat (uncomment if preferred)
				// if (newChatId) {
				//   navigation.navigate('ChatMessagesView', { 
				//     chatId: newChatId,
				//     userId: currentUserId,
				//     chatName: finalChatName
				//   });
				// } else {
				//   navigation.navigate('ChatsMain');
				// }
			} else {
				// Critical error - failed to create chat
				throw new Error("Failed to create chat");
			}
		} catch (err) {
			// Handle and log any errors that occur during chat creation
			console.error("Error creating new chat:", err);
			Alert.alert("Error", "Failed to create chat. Please try again.");
		} finally {
			// Always hide the loading indicator when done, even if an error occurred
			setIsLoading(false);
		}
	};

	/*const filteredFriends = friends.filter(friend =>
		friend["username"].toLowerCase().includes(searchQuery.toLowerCase())
	);*/

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Create New Chat</Text>
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
						autoCapitalize="none"
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

			{/* Selected users section */}
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

			{/* Group name input (only shown for group chats) */}
			{selectedUsers.length > 1 && (
				<View style={styles.groupNameContainer}>
					<TextInput
						style={styles.groupNameInput}
						placeholder="Group Name (required)"
						placeholderTextColor="#8E8E93"
						value={chatTitle}
						onChangeText={setChatTitle}
						maxLength={30}
					/>
					{isGroupChat && !isTitleValid() && (
						<Text style={styles.validationText}>Group name is required</Text>
					)}
				</View>
			)}

			{/* Friends list */}
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
										{friend['username']}
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
						{searchQuery ? "No friends match your search" : "No friends available for chat"}
					</Text>
				)}
			</ScrollView>

			{/* Bottom button with blur effect */}
			<BlurView
				style={styles.buttonContainer}
				intensity={80}
				tint="light"
			>
				<TouchableOpacity
					style={[
						styles.createButton,
						(selectedUsers.length === 0 || (isGroupChat && !isTitleValid())) && styles.disabledButton,
					]}
					onPress={handleCreateChat}
					disabled={selectedUsers.length === 0 || (isGroupChat && !isTitleValid()) || isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={styles.createButtonText}>
							{selectedUsers.length === 0 ? "Select Friends to Chat" :
								(selectedUsers.length === 1 ? "Start Chat" : "Create Group Chat")}
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
		backgroundColor: '#F2F2F7', // iMessage light background color
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
	groupNameContainer: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E9E9EB',
	},
	groupNameInput: {
		backgroundColor: '#E9E9EB',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		color: '#000000',
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
	createButton: {
		backgroundColor: '#007AFF', // iMessage blue
		padding: 14,
		borderRadius: 24,
		alignItems: "center",
	},
	disabledButton: {
		backgroundColor: '#E9E9EB',
	},
	createButtonText: {
		color: '#FFFFFF',
		fontWeight: "600",
		fontSize: 16,
	},
	validationText: {
		color: '#FF3B30',
		fontSize: 14,
		marginTop: 8,
		marginLeft: 4,
	},
});

export default AddChatView;
