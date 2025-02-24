import React, { useEffect } from 'react';
import { View } from "react-native";
import { Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

const GoogleLogin = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: 1, // need to add
    redirectUri: makeRedirectUri({
        useProxy: true
    })
  });

  useEffect(() => {
    console.log(response)
    if (response?.type === 'success') {
      const { id_token } = response.params;
      // Exchange the id_token for user information
      fetchGoogleUserInfo(id_token);
    }
  }, [response]);

  const fetchGoogleUserInfo = async (idToken) => {
    try {
      const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
      const userInfo = await res.json();

      // Check if the user's email ends with '@uw.edu'
      if (userInfo.email.endsWith('@uw.edu')) {
        console.log('Login successful: ', userInfo);
        // Proceed with your app logic (navigate, store user info, etc.)
      } else {
        console.log('Only UW accounts are allowed');
        // Handle non-UW email (show an error, etc.)
      }
    } catch (error) {
      console.error('Error fetching user info: ', error);
    }
  };

  const logout = async () => {
    try {
        console.log("Hi?")
        const results = await Google.logOutAsync()
    } catch (err) {
        throw (err)
    }
  }

  return (
    <View>
        <Button
            title="Login with Google"
            onPress={() => promptAsync()} // Initiates the OAuth flow
        />
        <Button
            title="Logout"
            onPress={() => logout()} 
        />
    </View>
    
  );
};

export default GoogleLogin;