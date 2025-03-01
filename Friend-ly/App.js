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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InterestSelectionView from './ui/screens/InterestSelectionView';
import ProfileViewEditMode from './ui/screens/ProfileViewEditMode';
import SelfProfileView from './ui/screens/SelfProfileView';
import ClassesView from './ui/screens/ClassesView';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ClassesView">
                <Stack.Screen name="ClassesView" component={ClassesView} />
                <Stack.Screen name="InterestSelectionView" component={InterestSelectionView} />
                <Stack.Screen name="ProfileViewEditMode" component={ProfileViewEditMode} />
                <Stack.Screen name="SelfProfileView" component={SelfProfileView} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
