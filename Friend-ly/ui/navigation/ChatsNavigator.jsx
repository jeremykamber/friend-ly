import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatsView from "../screens/ChatsView";
import ChatMessagesView from "../screens/ChatMessagesView";
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
                    title: `Chat #${route.params.chatId}`,
                    headerShown: true,
                })}
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