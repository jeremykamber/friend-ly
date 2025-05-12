
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import LoginForm from "../forms/LoginForm";
import appColors from "../common/app-colors";
import { getEmailIfValid } from "../common/helpers/secureStorage";

const LoginView = ({ navigation }) => {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkStoredEmail = async () => {
            try {
                const email = await getEmailIfValid();
                if (email) {
                    // User already verified, skip to the next screen
                    navigation.navigate("InterestSelectionView");
                }
            } catch (error) {
                console.error("Error checking stored email:", error);
            } finally {
                setChecking(false);
            }
        };
        checkStoredEmail();
    }, []);

    const onLoginSuccess = () => {
        navigation.navigate("InterestSelectionView");
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
