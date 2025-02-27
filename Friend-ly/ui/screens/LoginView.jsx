import React, {useState} from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import LoginForm from "../forms/LoginForm";
import { GoogleAuthProvider } from "firebase/auth";
import { signIn } from "firebase/auth";
import { auth } from "../../server/firebase/firebase";
import appColors from "../common/app-colors"; // Import your appColors
import * as SecureStore from 'expo-secure-store'

const LoginView = ({ navigation }) => {
    const microsoftProvider = new GoogleAuthProvider();

    /*
        This function stores a JWT token in secure store.
        The key used is "JWT", this key must be used
        to retrieve the token elsewhere in the program.
    */
    const storeToken = async (token) => {
        try {
            await SecureStore.setItemAsync("JWT", token)
        } catch (err) {
            throw (err)
        }
    }

    /*
        This function authenticates an email. 
        It retrieves a token and stores it in 
        secure storage, and then navigates to chat.
    */
    const authLogin = async (email) => {
        try {
            //const results = await signInWithRedirect(auth, microsoftProvider);
            const response = await fetch("http://localhost:6262/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "lebron23@uw.edu" }),
            });
            if (response.ok) {
                const data = await response.json();
                await storeToken(data)
                navigation.navigate("Chat");
            }
        } catch (err) {
            throw err;
        }
        // TODO: Implement mobile-friendly login popup
        
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <View style={{ height: 40 }} />
            <LoginForm onSubmit={authLogin} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: appColors.White, // Updated to match app color scheme
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: appColors.Black, // Text color updated to match app color scheme
        marginBottom: 20,
    },
});

export default LoginView;
