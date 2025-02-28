import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsView from "../screens/SettingsView";
import EditUsernameView from "../screens/EditUsernameView";

const Stack = createStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsView}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EditUsername" 
        component={EditUsernameView}
        options={{ 
          title: "Edit Username",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;