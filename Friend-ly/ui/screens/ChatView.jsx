import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import appColors from "../common/app-colors";
import ChatConversationCard from "../components/ChatConversationCard";
import MinimalPlusButton from "../components/MinimalPlusButton";
import PlusButton from "../components/PlusButton";
import PrimaryButton from "../components/PrimaryButton";

const ChatView = () => {
    let addConversation = () => {
        // TODO: Implement addConversation functionality
    };
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
                <ChatConversationCard
                    senderName="Jeremy"
                    lastMessage="Hey, how are things?"
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
