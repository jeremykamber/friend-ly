import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SelfProfileView from "../screens/SelfProfileView";
import ProfileViewEditMode from "../screens/ProfileViewEditMode";
import InterestSelectionView from '../screens/InterestSelectionView';
import ClassesView from '../screens/ClassesView';

const Stack = createStackNavigator();

function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SelfProfileView" 
        component={SelfProfileView}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProfileViewEditMode" 
        component={ProfileViewEditMode}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ClassesView" component={ClassesView} options={{headerShown: false}} />
      <Stack.Screen name="InterestSelectionView" component={InterestSelectionView} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;