import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeView from "../screens/HomeView";
import ProfileView from '../screens/ProfileView';

const Stack = createStackNavigator();

function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeView" 
        component={HomeView}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProfileView" 
        component={ProfileView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigator;