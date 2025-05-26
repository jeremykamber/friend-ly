import React, { useState } from "react";
import { View, StyleSheet, Alert, TextInput, Text } from "react-native";
import Button from "../components/PrimaryButton";
import appColors from "../common/app-colors";
import { storeEmail } from "../common/helpers/secureStorage";

const LoginForm = ({ onLoginSuccess }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false); // For sending/verification
    const [resending, setResending] = useState(false); // For resending code

    const handleSendVerificationEmail = async () => {
        console.log("[LoginForm] handleSendVerificationEmail called with email:", email);
        if (!email) {
            console.log("[LoginForm] No email entered");
            Alert.alert("Validation Error", "Please enter your email.");
            return;
        }

        // Check if the email is a UW email
        if (!email.endsWith("@uw.edu")) {
            console.log("[LoginForm] Email does not end with @uw.edu");
            Alert.alert("Validation Error", "Only @uw.edu emails are allowed.");
            return;
        }

        setLoading(true);
        try {
            // TODO: Make sure to change to localhost if using simulator
            console.log("[LoginForm] Sending verification email to:", email);
            const response = await fetch("http://10.18.75.225:8000/users/sendVerificationEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setEmailSent(true);
                console.log("[LoginForm] Verification email sent successfully");
                Alert.alert("Success", "Verification email sent. Please check your inbox.");
            } else {
                const errorText = await response.text();
                console.log("[LoginForm] Error sending verification email:", errorText);
                Alert.alert("Error", errorText || "Failed to send verification email.");
            }
        } catch (error) {
            console.log("[LoginForm] Exception while sending verification email:", error);
            Alert.alert("Error", "An error occurred while sending the email.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        console.log("[LoginForm] handleVerifyCode called with email:", email, "code:", verificationCode);
        if (!verificationCode) {
            console.log("[LoginForm] No verification code entered");
            Alert.alert("Validation Error", "Please enter the verification code.");
            return;
        }

        setLoading(true);
        try {
            // Step 1: Verify the code
            console.log("[LoginForm] Verifying code for email:", email);
            const verifyResponse = await fetch("http://10.18.75.225:8000/users/verifyEmailCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, code: verificationCode }),
            });

            if (!verifyResponse.ok) {
                const errorText = await verifyResponse.text();
                console.log("[LoginForm] Verification code failed:", errorText);
                Alert.alert("Error", errorText || "Invalid verification code. Please try again.");
                setLoading(false);
                return;
            }
            console.log("[LoginForm] Verification code accepted for email:", email);

            // Step 2: Get JWT token from /api/auth
            console.log("[LoginForm] Requesting JWT token from /api/auth for email:", email);
            const authResponse = await fetch("http://10.18.75.225:6262/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!authResponse.ok) {
                const errorText = await authResponse.text();
                console.log("[LoginForm] Error authenticating user after verification:", errorText);
                Alert.alert("Error", errorText || "Failed to authenticate user after verification.");
                setLoading(false);
                return;
            }
            const authData = await authResponse.json();
            if (authData.token) {
                // Store the JWT token in SecureStore
                const SecureStore = require('expo-secure-store');
                await SecureStore.setItemAsync("JWT", authData.token);
                console.log("[LoginForm] JWT token stored in SecureStore");
            } else {
                console.log("[LoginForm] No token received from /api/auth response:", authData);
            }

            // Store the verified email with 7-day expiration (if you want to keep this logic)
            await storeEmail(email);
            console.log("[LoginForm] Email stored in SecureStore");
            Alert.alert("Success", "Email verified successfully!");
            await onLoginSuccess(email); // Navigate to the home page
        } catch (error) {
            console.log("[LoginForm] Exception during verification/auth:", error);
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
                    <Button text={loading ? "Verifying..." : "Verify Code"} onPress={handleVerifyCode} disabled={resending} />
                    <Button
                        text={resending ? "Resending..." : "Resend Code"}
                        onPress={async () => {
                            console.log("[LoginForm] Resend code button pressed for email:", email);
                            setResending(true);
                            try {
                                const response = await fetch("http://10.18.75.225:8000/users/resendVerificationEmail", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email }),
                                });
                                if (response.ok) {
                                    console.log("[LoginForm] Verification code resent successfully");
                                    Alert.alert("Success", "Verification code resent. Please check your inbox.");
                                } else {
                                    const errorText = await response.text();
                                    console.log("[LoginForm] Resend error:", errorText);
                                    Alert.alert("Error", errorText || "Failed to resend verification code.");
                                }
                            } catch (error) {
                                console.log("[LoginForm] Exception while resending code:", error);
                                Alert.alert("Error", "An error occurred while resending the code.");
                            } finally {
                                setResending(false);
                            }
                        }}
                        disabled={loading}
                    />
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
        backgroundColor: appColors.White,
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
