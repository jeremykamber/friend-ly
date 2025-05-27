import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import SettingsNavigator from "./SettingsNavigator";
import ChatsNavigator from "./ChatsNavigator";
import ProfileNavigator from "./ProfileNavigator";
import HomeNavigator from "./HomeNavigator";
import PeopleNavigator from "./PeopleNavigator";

const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatsNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="People"
                component={PeopleNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            
            
            {/*
            <Tab.Screen
                name="Login"
                component={LoginView}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            */}
            
            <Tab.Screen
                name="Settings"
                component={SettingsNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

export default TabNavigator;
