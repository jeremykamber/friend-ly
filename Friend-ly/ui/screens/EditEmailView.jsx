import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, Text, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import appColors from "../common/app-colors";

const EditEmailView = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // TODO: Implement email update logic
    navigation.goBack();
  };

  const isValid = validateEmail(email);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.helperText}>
            Your email is used for account recovery and important notifications. 
            A verification link will be sent to confirm your new email address.
          </Text>
          <InputField
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={error}
            maxLength={50}
          />
          {email.length > 0 && !validateEmail(email) && !error && (
            <Text style={styles.validationText}>
              Please enter a complete email address
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

export default EditEmailView;