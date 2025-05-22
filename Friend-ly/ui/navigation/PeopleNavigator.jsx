import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import RecommendationView from "../screens/RecommendationView";
import FriendsConnection from "./FriendsConnection";
import appColors from "../common/app-colors";

const Tab = createMaterialTopTabNavigator();

function PeopleNavigator() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarIndicatorStyle: styles.indicator,
                    tabBarActiveTintColor: appColors.UW_Purple,
                    tabBarInactiveTintColor: appColors.Grey_600,
                    tabBarLabelStyle: styles.tabLabel,
                }}
            >
                <Tab.Screen
                    name="Recommendations"
                    component={RecommendationView}
                    options={{ tabBarLabel: "Recommendations" }}
                />
                <Tab.Screen
                    name="Friends"
                    component={FriendsConnection}
                    options={{ tabBarLabel: "Friends" }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.White,
    },
    tabBar: {
        backgroundColor: appColors.White,
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
        borderBottomWidth: 1,
        borderBottomColor: appColors.Grey_100,
    },
    indicator: {
        backgroundColor: appColors.UW_Purple,
        height: 3,
    },
    tabLabel: {
        fontWeight: '600',
        textTransform: 'none', // Prevents all-caps
    }
});

export default PeopleNavigator;
