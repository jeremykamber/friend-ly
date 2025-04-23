/*
// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./ui/navigation/TabNavigator"; // Import the TabNavigator

const App = () => {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
};

export default App;
*/

// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./ui/navigation/TabNavigator"; // Import the TabNavigator
import { createStackNavigator } from '@react-navigation/stack';
import InterestSelectionView from './ui/screens/InterestSelectionView';
import ClassesView from './ui/screens/ClassesView';
import LoginView from './ui/screens/LoginView';
import ProfilePictureView from './ui/screens/ProfilePictureView';
import BioInformationView from './ui/screens/BioInformationView';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="BioInformationView">
                <Stack.Screen name="LoginView" component={LoginView} options={{headerShown: false}} />
                <Stack.Screen name="ClassesView" component={ClassesView} options={{headerShown: false}} />
                <Stack.Screen name="InterestSelectionView" component={InterestSelectionView} options={{headerShown: false}} />
                <Stack.Screen name="ProfilePictureView" component={ProfilePictureView} options={{headerShown: false}} />
                <Stack.Screen name="BioInformationView" component={BioInformationView} options={{headerShown: false}} />
                <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;