import { getChatHistory, getChatUsers, addUsersToChat, postNewMessage, updateMessageSeen, getUserInfo } from '../mocks/backendMock';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MessageBubble from '../components/MessageBubble';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Change the function signature to receive route and navigation
const ChatMessagesView = ({ route, navigation }) => {
    // Extract parameters from route.params
    const { chatId, userId } = route.params;

    console.log("Chat ID:", chatId);
    console.log("User ID:", userId);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollViewRef = useRef();

    // Fetch messages and mark them as seen
    const fetchMessages = async () => {
        const fetchedMessages = await getChatHistory(chatId);
        console.log(fetchedMessages
        );
        setMessages(fetchedMessages);

        // Mark messages as seen
        for (const message of fetchedMessages) {
            if (message.sender_id !== userId && !message.seen_by?.includes(userId)) {
                await updateMessageSeen(true, message.id, userId, chatId);
            }
        }
    };

    useEffect(() => {
        fetchMessages();
        getChatUsers(chatId).then(setUsers);

        // Set up polling for new messages and status updates
        const intervalId = setInterval(fetchMessages, 5000);

        return () => clearInterval(intervalId);
    }, [chatId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        // Create a temporary local message with "sending" status
        const tempId = `temp-${Date.now()}`;
        const now = new Date();
        const tempMessage = {
            id: tempId,
            message_text: newMessage,
            sender_id: userId,
            sent_at: now.toISOString(), // Ensure valid ISO format
            seen_by: [userId],
            status: 'sending'
        };

        // Add temporary message to the UI
        setMessages(prevMessages => [...prevMessages, tempMessage]);
        setNewMessage('');

        try {
            // Send the message to the backend
            const messageData = await postNewMessage(userId, chatId, newMessage);

            // Check if messageData is a valid message object
            if (typeof messageData === 'string' || !messageData.message_id) {
                console.warn('Backend returned invalid message data:', messageData);

                // Keep the temp message with updated status instead of replacing it
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === tempId ? { ...tempMessage, status: 'delivered' } : msg
                    )
                );
            } else {
                // Replace temporary message with the actual one
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === tempId ? { ...messageData, status: 'delivered' } : msg
                    )
                );
            }
        } catch (error) {
            console.error('Failed to send message:', error);

            // Mark the message as failed
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === tempId ? { ...msg, status: 'failed' } : msg
                )
            );
        }

        // Scroll to the bottom after message is sent
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const formatMessageTime = (timestamp) => {
        // Guard against invalid timestamps
        if (!timestamp) return '';

        let date;
        try {
            // Handle different timestamp formats
            if (timestamp instanceof Date) {
                date = timestamp;
            } else if (typeof timestamp === 'string') {
                date = parseISO(timestamp);
            } else if (typeof timestamp === 'number') {
                date = new Date(timestamp);
            } else {
                return '';
            }

            // Verify we have a valid date
            if (!isValid(date)) {
                console.warn('Invalid date:', timestamp);
                return '';
            }

            const now = new Date();

            // If message is from today, show time only
            if (date.toDateString() === now.toDateString()) {
                return format(date, 'h:mm a'); // e.g., "3:30 PM"
            }

            // If message is from this week, show day and time
            const isWithinLastWeek = now - date < 7 * 24 * 60 * 60 * 1000;
            if (isWithinLastWeek) {
                return format(date, 'EEE h:mm a'); // e.g., "Wed 3:30 PM"
            }

            // Otherwise show date and time
            return format(date, 'MMM d, yyyy h:mm a'); // e.g., "Jan 15, 2023 3:30 PM"
        } catch (error) {
            console.error('Error formatting date:', error, timestamp);
            return '';
        }
    };

    const getMessageStatus = (message) => {
        // If it's a temporary message still sending
        if (message.status === 'sending' || message.status === 'failed') {
            return message.status;
        }

        // If all users have seen the message
        if (message.seen_by && users.length > 0 &&
            users.every(user => message.seen_by.includes(user.id))) {
            return 'read';
        }

        // Otherwise, it's delivered but not read by everyone
        return 'delivered';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContainer}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            >
                {messages.map(message => {
                    // Guard against invalid message objects
                    if (!message || typeof message !== 'object' || !message.message_text) {
                        console.warn("Invalid message object:", message);
                        return null;
                    }

                    return (
                        <MessageBubble
                            key={message.id || `msg-${Math.random()}`}
                            message={message.message_text}
                            isCurrentUser={message.sender_id === userId}
                            timestamp={formatMessageTime(message.sent_at)}
                            username=''
                            status={message.sender_id === userId ? getMessageStatus(message) : null}
                        />
                    );
                })}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity onPress={handleSendMessage} disabled={!newMessage.trim()} style={styles.sendButton}>
                    <Ionicons name="send" size={20} color={newMessage.trim() ? "#007AFF" : "#ccc"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        padding: 16,
    },
    message: {
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0', // Lighter gray color
        borderRadius: 30,
        padding: 12,
        paddingRight: 40, // Add padding to the right to make space for the send button
    },
    sendButton: {
        position: 'absolute',
        right: 32,
        bottom: 27,
    },
});

export default ChatMessagesView;