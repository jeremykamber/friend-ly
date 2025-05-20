// Example App.js integration with AppSyncProvider
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from "./ui/navigation/TabNavigator";
import InterestSelectionView from './ui/screens/InterestSelectionView';
import ClassesView from './ui/screens/ClassesView';
import LoginView from './ui/screens/LoginView';
import AddChatView from './ui/screens/AddChatView';
import ProfilePictureView from './ui/screens/ProfilePictureView';
import BioInformationView from './ui/screens/BioInformationView';
import { AppSyncProvider } from './ui/common/providers/AppSyncProvider';

const Stack = createStackNavigator();

const App = () => {
    return (
        <AppSyncProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginView">
                    <Stack.Screen name="LoginView" component={LoginView} options={{ headerShown: false }} />
                    <Stack.Screen name="ClassesView" component={ClassesView} options={{ headerShown: false }} />
                    <Stack.Screen name="InterestSelectionView" component={InterestSelectionView} options={{ headerShown: false }} />
                    <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="AddChatView" component={AddChatView} options={{ headerShown: false }} />
                    <Stack.Screen name="ProfilePictureView" component={ProfilePictureView} options={{ headerShown: false }} />
                    <Stack.Screen name="BioInformationView" component={BioInformationView} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppSyncProvider>
    );
};

export default App;
