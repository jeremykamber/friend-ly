import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileView from "../screens/ProfileView";
import RecommendationView from "../screens/RecommendationView";

const Stack = createStackNavigator();

function RecommendationNavigator() {
    return (
      <Stack.Navigator>
          <Stack.Screen 
              name="RecommendationView" 
              component={RecommendationView}
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

export default RecommendationNavigator;