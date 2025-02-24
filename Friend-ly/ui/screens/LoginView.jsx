import {React, useEffect, useState} from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import LoginForm from "../forms/LoginForm";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithCredential} from "firebase/auth";
import { signIn, signInWithPopup } from "firebase/auth";
import { auth } from "../../server/firebase/firebase";
import appColors from "../common/app-colors"; // Import your appColors
import GoogleLogin from "./GoogleLogin";

const LoginView = ({ navigation }) => {

    /*useEffect(() => {
        GoogleSignin.configure({
            webClientId: "872954733121-ll542sg47ekvh3pcaka3gf8105bk4vt0.apps.googleusercontent.com"
        })
    })*/

    /*const signin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn()
            console.log(user)
        } catch (error) {
            throw error
        }
    }*/

    //const provider = new GoogleAuthProvider()
    /*
    const authLogin = async () => {
        try {
            //const results = await signInWithPopup(auth, provider);
            try {
                const response = await fetch("http://localhost:6262/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: results.user.accessToken }),
                });
                const data = await response.json();
                console.log("Auth response:", data);
                console.log('Token: ', results.user.accessToken)
                if (data) {
                    navigation.navigate("Chat")
                }
            } catch (err) {
                console.error("Error during authentication:", err);
            }
        } catch (err) {
            throw err;
        }
    }
    /*const authLogin = async() => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("Google Sign-In Result:", userInfo);
    
            if (!userInfo.user.email.endsWith("@uw.edu")) {
                console.error("Only UW students can log in.");
            }
            const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
            const result = await signInWithCredential(auth, googleCredential);
            console.log("Firebase Sign-In Result:", result);
            navigation.navigate("Chat");
        } catch (error) {
            console.log(error)
        }
    }
    
    /*const provider = new GoogleAuthProvider();
    const [loggedIn, setLoggedIn] = useState(false)

    const authLogin = async () => {
        // navigation.navigate("Chat");
        // TODO: Implement mobile-friendly login popup
        /*try {
            const results = await signInWithRedirect(auth, microsoftProvider);
            //setLoggedIn(true)
            try {
                const response = await fetch("http://localhost:6262/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: results.user.accessToken }),
                });
                const data = await response.json();
                
                console.log("Auth response:", data);
                navigation.navigate("Chat")
                //return data;
            } catch (err) {
                console.error("Error during authentication:", err);
            }
        } catch (err) {
            throw err;
        }*/
       /*
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.log(error);
        }
    };*/

    /*const checkRedirectResult = async () => {
        try {
            console.log("Checking redirect result...");
            const result = await getRedirectResult(auth);
            console.log("Redirect result:", result);
    
            if (result?.user) {
                console.log("User Info from redirect:", result.user);
            } else if (auth.currentUser) {
                /*
                try {
                    const response = await fetch("http://localhost:6262/api/auth", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: auth.currentUser.accessToken }),
                    });
                    const data = await response.json();
                    
                    console.log("Auth response:", data);
                    navigation.navigate("Chat")
                    //return data;
                } catch (err) {
                    console.error("Error during authentication:", err);
                }
                console.log("User already signed in (fallback):", auth.currentUser);
            } else {
                console.log("No user found.");
            }
        } catch (error) {
            console.error("Error getting redirect result:", error);
        }
    }

    /*useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("User already signed in:", user);
            } else {
                console.log("No user session found.");
            }
        });
        checkRedirectResult();

        return () => unsubscribe();
    }, [])*/



    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <View style={{ height: 40 }} />
            <GoogleLogin></GoogleLogin>
        </SafeAreaView>
    );
    // <LoginForm onSubmit={signin} />
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
