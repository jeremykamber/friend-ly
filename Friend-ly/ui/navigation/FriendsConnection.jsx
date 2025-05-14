import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PeopleView from "../screens/PeopleView";
import ProfileView from "../screens/ProfileView";
import ChatsNavigator from "./ChatsNavigator";

const Stack = createStackNavigator();

function FriendsConnection() {
    return (
      <Stack.Navigator>
          <Stack.Screen 
              name="PeopleView" 
              component={PeopleView}
              options={{ headerShown: false }}
          />
          <Stack.Screen 
              name="ProfileView" 
              component={ProfileView}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="ChatsView"
              component={ChatsNavigator}
              options={{ headerShown: false }}
          />
      </Stack.Navigator>
  );
}

export default FriendsConnection;