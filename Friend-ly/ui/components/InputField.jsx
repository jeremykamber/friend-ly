import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Keyboard, Platform } from 'react-native';
import appColors from '../common/app-colors';

const InputField = ({ 
  label,
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  error,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  maxLength,
}) => {
  const inputRef = useRef(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        error && styles.inputContainerError,
        Platform.select({
          ios: styles.inputContainerIOS,
          android: styles.inputContainerAndroid,
        })
      ]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={appColors.Grey_600}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: appColors.Dark_Grey,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: appColors.White,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputContainerIOS: {
    shadowColor: appColors.Black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputContainerAndroid: {
    elevation: 2,
  },
  inputContainerError: {
    backgroundColor: '#fff0f0',
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#ff3b30',
      shadowOpacity: 0.1,
    } : {
      borderWidth: 1,
      borderColor: '#ff3b30',
    }),
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 16,
    color: appColors.Dark_Grey,
    ...Platform.select({
      ios: {
        paddingVertical: 14,
      },
      android: {
        paddingVertical: 12,
      },
    }),
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  }
});

export default InputField;