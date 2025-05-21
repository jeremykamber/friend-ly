import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, StyleSheet, Text, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import appColors from "../common/app-colors";
import * as SecureStore from 'expo-secure-store'

const MIN_USERNAME_LENGTH = 3;

const EditUsernameView = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null)

  useEffect(() => {
      const getToken = async() => {
          try {
              const result = await SecureStore.getItemAsync("JWT") // jwt token
              result ? setToken(result) : ("No token found!")
          } catch (err) {
              throw err
          }
      }
      getToken()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTitleStyle: {
        fontSize: 17,
        fontWeight: '600',
      },
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const handleSave = async () => {
    Keyboard.dismiss();
    if (username.trim().length < MIN_USERNAME_LENGTH) {
      return;
    }

    try {
      const results = await fetch("http://localhost:8000/users/editUName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, username: username.trim()})
      })
    } catch (err) {
      throw (err);
    }

    // TODO: Implement username update logic
    navigation.goBack();
  };

  const isValid = username.trim().length >= MIN_USERNAME_LENGTH;
  if (token === null) {
    return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
            );
  }
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.helperText}>
            Choose a username that will be visible to other users in chats and your profile.
          </Text>
          <InputField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={30}
          />
          {username.length > 0 && !isValid && (
            <Text style={styles.validationText}>
              Username must be at least {MIN_USERNAME_LENGTH} characters
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            text="Save Changes"
            onPress={handleSave}
            disabled={!isValid}
            style={[!isValid && styles.buttonDisabled]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.White,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: appColors.White,
    padding: 20,
    marginTop: 20,
  },
  helperText: {
    fontSize: 15,
    color: appColors.Grey_600,
    marginBottom: 20,
    lineHeight: 20,
  },
  validationText: {
    fontSize: 13,
    color: appColors.Grey_600,
    marginTop: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: appColors.UW_Purple,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default EditUsernameView;