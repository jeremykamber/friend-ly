import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatsView from "../screens/ChatsView";
import ChatMessagesView from "../screens/ChatMessagesView";
import AddChatView from "../screens/AddChatView";
import AddPeopleView from "../screens/AddPeopleView";
import ChatMessagesViewDB from "../screens/ChatMessagesViewDB";

const Stack = createStackNavigator();

function ChatsNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ChatsMain"
                component={ChatsView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChatMessagesView"
                component={ChatMessagesView}
                options={({ route }) => ({
                    title: route.params.chatName || `Chat #${route.params.chatId}`,
                    headerShown: true,
                })}
            />
            <Stack.Screen
                name="AddChatView"
                component={AddChatView}
                options={{
                    title: "Create New Chat",
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="AddPeopleView"
                component={AddPeopleView}
                options={{
                    title: "Add People",
                    headerShown: true
                }}
            />
            <Stack.Screen 
                name="ChatMessagesViewDB" 
                component={ChatMessagesViewDB}
                options={({ route }) => ({ 
                    title: `${route.params.chatName}`,
                    headerShown: true,
                })}
            />
        </Stack.Navigator>
    );
}

export default ChatsNavigator;