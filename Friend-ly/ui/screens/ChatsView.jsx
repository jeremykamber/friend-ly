import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import appColors from "../common/app-colors";
import ChatConversationCard from "../components/ChatConversationCard";
import MinimalPlusButton from "../components/MinimalPlusButton";
import PlusButton from "../components/PlusButton";
import PrimaryButton from "../components/PrimaryButton";
import * as SecureStore from 'expo-secure-store'
import {createNewConversation} from '../mocks/backendMock';
import formatMessageTime from "./timeFormat";


const ChatsView = ({navigation}) => {


    const [lastMessages, setLastMessages] = useState([])
    const [token, setToken] = useState(null)
    const [userID, setUserID] = useState(null)
    const dateFormat = new Intl.DateTimeFormat('en-US', {
                            timeZone: 'America/Los_Angeles',
                            dateStyle: 'full',
                            timeStyle: 'long',
                        })
    
    /*
        This useFocusEffect runs upon load up of chat.
        This loads in the token from secure storage
        and sets the useState token variable to the result
        of the token, or keeps it as null. It additionally 
        gets the user id and the messages from each chat. 
    */
    useFocusEffect(
        useCallback(() => {
            const getInfo = async() => {
                try {
                    const result = await SecureStore.getItemAsync("JWT") // jwt token
                    if (!result) {
                        console.log("No token found.")
                        return
                    }
                    setToken(result)
                    const response = await fetch("http://localhost:8000/users/getUserID", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: result})
                    })
                    if (!response.ok) {
                        console.log("Getting User ID failed. ")
                        return
                    }
                    const user_id = await response.json()
                    setUserID(user_id)
                    const messages = await fetch("http://localhost:8000/users/getLastMessageHistory", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: result })
                    })
                    if (!messages.ok) {
                        console.log("Getting messages failed.")
                        return
                    }
                    const messageData = await messages.json()
                    setLastMessages(messageData)
                } catch (err) {
                    throw err
                }
            }
            getInfo()
        }, [])
    )

    let addConversation = async () => {
        navigation.navigate('AddChatView');

    };

    /*
        If the token hasn't been retrieved yet, just show a loading screen
    */
    if (token === null) {
        return (
        <SafeAreaView style={styles.container}>
            <Text>Loading...</Text>
        </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: appColors.Dark_Grey,
                }}>Messages</Text>
                <PlusButton
                    color={appColors.UW_Purple}
                    style={styles.plusButton}
                    onPress={addConversation}
                />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {lastMessages.map((message, index) => {
                    return (
                        <ChatConversationCard 
                            key={index}
                            senderName={message.chat_name}
                            lastMessage={message.sender_name + ": " + message.message_text}
                            timestamp={formatMessageTime(message.sent_at)}
                            onPress={() => navigation.navigate('ChatMessagesViewDB', { chatId: message.chat_id, 
                                                                                    userId: userID, chatName: message.chat_name })}
                        />
                    )
                })}
                <ChatConversationCard
                    senderName="Jeremy"
                    lastMessage={"Well hello there"}
                    timestamp="2:45 PM"
                    onPress={() => navigation.navigate('ChatMessagesView', { chatId: 1, userId: 1 })}
                />
                <ChatConversationCard
                    senderName="Alex"
                    lastMessage="Can we reschedule our meeting?"
                    timestamp="1:15 PM"
                    onPress={() => navigation.navigate('ChatMessagesView', { chatId: 2, userId: 1 })}
                />
                <ChatConversationCard
                    senderName="Mia"
                    lastMessage="Don't forget to bring the documents!"
                    timestamp="12:30 PM"
                    onPress={() => navigation.navigate('ChatMessagesView', { chatId: 3, userId: 1 })}
                />
                <ChatConversationCard
                    senderName="Sophia"
                    lastMessage="Thanks for your help yesterday!"
                    timestamp="Yesterday"
                    onPress={() => navigation.navigate('ChatMessagesView', { chatId: 4, userId: 1 })}
                />
                <ChatConversationCard
                    senderName="Liam"
                    lastMessage="What's your plan for the weekend?"
                    timestamp="Sunday"
                    onPress={() => navigation.navigate('ChatMessagesView', { chatId: 5, userId: 1 })}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.White,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Center the title by default
        marginVertical: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: appColors.Black,
    },
    plusButton: {
        position: "absolute", // Detach from the layout flow
        right: 10, // Align to the right
    },
    scrollContainer: {
        paddingBottom: 20,
    },
});

export default ChatsView
