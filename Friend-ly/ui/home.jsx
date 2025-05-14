import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
// TODO: Right workflow?

import { GoogleAuthProvider } from "firebase/auth"
import { signInWithPopup } from "firebase/auth"
import { auth } from '../server/firebase/firebase';


export function Home() {
   const microsoftProvider = new GoogleAuthProvider()
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
      });
    
    /* 
      Creates a popup for the user to login. 
      Done through Microsoft, server will check if
      the user is using a uw.edu email. 
    */
    const authLogin = async () => {
      try {
        const results = await signInWithPopup(auth, microsoftProvider)
        try {
          const response = await fetch('http://localhost:6262/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: results.user.accessToken }),
          });
          const data = await response.json();
          console.log('Auth response:', data);
          return data;
      } catch (err) {
          console.error('Error during authentication:', err);
      }
      // TODO: Do we need to do anything if server is authenticated. 
      } catch (err) {
        throw (err)
      }
    }

    return (
        <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <button onClick={authLogin}>Login with UW NetID</button>
        <StatusBar style="auto" />
        </View>
    )
}