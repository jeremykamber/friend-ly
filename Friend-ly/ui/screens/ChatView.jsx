import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import appColors from "../common/app-colors";
import ChatConversationCard from "../components/ChatConversationCard";
import MinimalPlusButton from "../components/MinimalPlusButton";
import PlusButton from "../components/PlusButton";
import PrimaryButton from "../components/PrimaryButton";
import * as SecureStore from 'expo-secure-store'

const ChatView = () => {

    const [token, setToken] = useState(null)
    const [lastMessages, setLastMessages] = useState([])

    /*
        This useEffect runs upon load up of chat.
        This loads in the token from secure storage
        and sets the useState token variable to the result
        of the token, or keeps it as null.
    */
    useEffect(() => {
        const getToken = async() => {
            try {
                const result = await SecureStore.getItemAsync("JWT") // jwt token
                result ? setToken(result) : console.log("No token found!")
            } catch (err) {
                throw err
            }
        }
        getToken()
    }, [])

    useEffect(() => {
        const getChats = async() => {
            try {
                console.log("Here?")
                const response = await fetch("http://localhost:8000/users/getLastMessageHistory", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: token })
                })
                const data = await response.json()
                setLastMessages(data)
            } catch (err) {
                throw (err);
            }
        }
        if (token) {
            getChats();
        }
    }, [token])


    let addConversation = () => {
        // TODO: Implement addConversation functionality
    };

    /*
        If the token hasn't been retrieved yet, just show a loading screen
    */
    if (token === null || lastMessages.length == 0) {
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
                {lastMessages.map((message, index) => (
                    <ChatConversationCard 
                        key={index}
                        senderName={message.chat_name}
                        lastMessage={message.sender_name + ": " + message.message_text}
                        timestamp={message.sent_at.toString().substring(12, 16)}
                    />
                ))}
                <ChatConversationCard
                    senderName="Jeremy"
                    lastMessage={"Well hello there"}
                    timestamp="2:45 PM"
                />
                <ChatConversationCard
                    senderName="Alex"
                    lastMessage="Can we reschedule our meeting?"
                    timestamp="1:15 PM"
                />
                <ChatConversationCard
                    senderName="Mia"
                    lastMessage="Don't forget to bring the documents!"
                    timestamp="12:30 PM"
                />
                <ChatConversationCard
                    senderName="Sophia"
                    lastMessage="Thanks for your help yesterday!"
                    timestamp="Yesterday"
                />
                <ChatConversationCard
                    senderName="Liam"
                    lastMessage="What's your plan for the weekend?"
                    timestamp="Sunday"
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

export default ChatView;
