
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import LoginForm from "../forms/LoginForm";
import appColors from "../common/app-colors";
import { getEmailIfValid, storeEmail, clearEmail } from "../common/helpers/secureStorage";
import * as SecureStore from 'expo-secure-store'

const LoginView = ({ navigation }) => {
    const [checking, setChecking] = useState(true);

    const setToken = async (token) => {
        try {
            await SecureStore.setItemAsync("JWT", token)
        } catch (err) {
            throw (err)
        }
    }

    const authLogin = async (email) => {
        console.log("We here?")
        try {
            // TODO: Make sure to change to localhost if using simulator
            const response = await fetch(`http://locahost:6262/api/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });
            const data = await response.json();
            console.log(data)
            await setToken(data["token"])
            console.log(data)
            return data["new_user"]
        } catch (err) {
            throw err;
        }

    };

    useEffect(() => {
        const checkStoredEmail = async () => {
            try {
                await clearEmail()
                const email = await getEmailIfValid();
                if (email) {
                    // Reset email in storage
                    await storeEmail(email)
                    // User already verified, skip to the next screen
                    let res = authLogin(email);
                    navigation.navigate("TabNavigator")
                }
            } catch (error) {
                console.error("Error checking stored email:", error);
            } finally {
                setChecking(false);
            }
        };
        checkStoredEmail();
    }, []);

    const onLoginSuccess = async (email) => {
        //let res = await authLogin(email);
        let res = true
        if (res == true) {
            navigation.navigate("ClassesView")
        } else {
            // navigation.navigate("TabNavigator")
            navigation.navigate("ClassesView")
        }
    };

    if (checking) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <View style={{ height: 40 }} />
            <LoginForm onLoginSuccess={onLoginSuccess} />
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
