import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import LoginForm from "../forms/LoginForm";
import { GoogleAuthProvider } from "firebase/auth";
import { signIn } from "firebase/auth";
import { auth } from "../../server/firebase/firebase";
import appColors from "../common/app-colors"; // Import your appColors
import * as SecureStore from "expo-secure-store"
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID, // From Firebase Console
    offlineAccess: true,
});

const LoginView = ({ navigation }) => {
    const microsoftProvider = new GoogleAuthProvider();

    const setToken = async (token) => {
        try {
            await SecureStore.setItemAsync("JWT", token)
        } catch (err) {
            throw (err)
        }
    }

    async function onGoogleButtonPress() {
        // 1. Check Play Services
        await GoogleSignin.hasPlayServices();

        // 2. Get ID Token
        const { idToken } = await GoogleSignin.signIn();

        // 3. Create Firebase Credential
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // 4. Sign-In with Credential
        return auth().signInWithCredential(googleCredential);
    }

    const authLogin = async (email) => {
        try {
            //const results = await signInWithRedirect(auth, microsoftProvider);
            const response = await fetch("http://localhost:6262/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "messi@uw.edu" }),
            });
            const data = await response.json();
            await setToken(data["token"])
            if (data["new_user"]) {
                navigation.navigate("ClassesView")
            } else {
                navigation.navigate("TabNavigator");
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
            <LoginForm onSubmit={onGoogleButtonPress} />
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
