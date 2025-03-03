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

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ClassesView">
                <Stack.Screen name="LoginView" component={LoginView} options={{headerShown: false}} />
                <Stack.Screen name="ClassesView" component={ClassesView} options={{headerShown: false}} />
                <Stack.Screen name="InterestSelectionView" component={InterestSelectionView} options={{headerShown: false}} />
                <Stack.Screen name="TabNavigator" component={TabNavigator} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

/*
// App.js
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InterestSelectionView from './ui/screens/InterestSelectionView';
import ProfileViewEditMode from './ui/screens/ProfileViewEditMode';
import SelfProfileView from './ui/screens/SelfProfileView';
import ClassesView from './ui/screens/ClassesView';
import HomeView from './ui/components/AddPosts';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeView">
                <Stack.Screen name="HomeView" component={HomeView} />
                <Stack.Screen name="ClassesView" component={ClassesView} />
                <Stack.Screen name="InterestSelectionView" component={InterestSelectionView} />
                <Stack.Screen name="ProfileViewEditMode" component={ProfileViewEditMode} />
                <Stack.Screen name="SelfProfileView" component={SelfProfileView} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
*/