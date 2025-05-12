import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TextInput, Text } from "react-native";
import Button from "../components/PrimaryButton";
import appColors from "../common/app-colors"; // Import your appColors

const LoginForm = ({ onLoginSuccess }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const getToken = async () => {
            try {
                const result = await SecureStore.getItemAsync("JWT") // jwt token
                result ? setToken(result) : console.log("No token found!")
            } catch (err) {
                throw err
            }
        }
        getToken()
    }, [])

    const handleSendVerificationEmail = async () => {
        if (!email) {
            Alert.alert("Validation Error", "Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending verification email to:", email);
            const response = await fetch("http://localhost:8000/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            //const response = await fetch("http://localhost:8000/users/sendVerificationEmail", {
            //    method: "POST",
            //    headers: { "Content-Type": "application/json" },
            //    body: JSON.stringify({ email }),
            //});

            if (response.ok) {
                setEmailSent(true);
                Alert.alert("Success", "Verification email sent. Please check your inbox.");
            } else {
                const errorText = await response.text();
                Alert.alert("Error", errorText || "Failed to send verification email.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "An error occurred while sending the email.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            Alert.alert("Validation Error", "Please enter the verification code.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/users/verifyEmailCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            if (response.ok) {
                Alert.alert("Success", "Email verified successfully!");
                onLoginSuccess(); // Navigate to the home page
            } else {
                const errorText = await response.text();
                Alert.alert("Error", errorText || "Invalid verification code. Please try again.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while verifying the code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {!emailSent ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={appColors.Grey_600}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Button text={loading ? "Sending..." : "Get started"} onPress={handleSendVerificationEmail} />
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Verification Code"
                        placeholderTextColor={appColors.Grey_600}
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="numeric"
                    />
                    <Button text={loading ? "Verifying..." : "Verify Code"} onPress={handleVerifyCode} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    input: {
        backgroundColor: appColors.Grey_100,
        width: 300,
        height: 50,
        color: appColors.Black,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: appColors.Black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default LoginForm;
