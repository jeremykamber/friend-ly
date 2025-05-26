import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RecommendationView from "../screens/RecommendationView";
import PeopleView from "../screens/PeopleView";
import FriendsConnection from "./FriendsConnection";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

function PeopleNavigator() {
    return (
        <SafeAreaView flex={1}>
            <Tab.Navigator>
                <Tab.Screen
                    name="Recommendations"
                    component={RecommendationView}
                    options={{tabBarLabel: "Recommendations"}}
                />
                <Tab.Screen
                    name="Friends"
                    component={FriendsConnection}
                    options={{tabBarLabel: "Friends"}}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

export default PeopleNavigator;
