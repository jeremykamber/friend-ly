import React, { useState, useLayoutEffect } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, StatusBar, Animated, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsSection from "../components/SettingsSection";
import SettingsItem from "../components/SettingsItem";
import appColors from "../common/app-colors";
import { useSettingsStore } from "../stores/settingsStore";
import Card from "../components/Card";
import { Ionicons } from '@expo/vector-icons';
import AppButton from "../components/AppButton";
import * as SecureStore from 'expo-secure-store';
import { clearEmail } from "../common/helpers/secureStorage";

const SettingsView = ({ navigation }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const darkMode = useSettingsStore(state => state.darkMode);
  const toggleDarkMode = useSettingsStore(state => state.toggleDarkMode);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerShown: true,
      headerStyle: {
        backgroundColor: appColors.White,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTitleStyle: {
        fontSize: 17,
        fontWeight: '600',
        color: appColors.Dark_Grey,
      },
    });

    // Animate content in when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [navigation, fadeAnim]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = () => {
    const languages = ["English", "French", "Spanish"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: async () => {
            try {
              // Clear JWT token
              await SecureStore.deleteItemAsync("JWT");

              // Clear stored email
              await clearEmail();

              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginView' }],
              });
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleHelpAndSupport = () => {
    Alert.alert(
      "Help & Support",
      "Need assistance with Friend-ly? Contact us at support@friend-ly.app or visit our support center."
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      "Terms of Service",
      "By using Friend-ly, you agree to our Terms of Service. These terms outline the rules for using our platform, including user conduct, content guidelines, and our service limitations."
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Friend-ly values your privacy. Our Privacy Policy explains how we collect, use, and protect your personal information. We only collect data necessary to provide and improve our services."
    );
  };

  const handleNotifications = () => {
    navigation.navigate('NotificationsSettings');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={appColors.White} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Account Section */}
          <Card variant="default" style={styles.sectionCard}>
            <Card.Header>
              <View style={styles.sectionHeader}>
                <Card.Title>Account</Card.Title>
                <Ionicons name="person-circle-outline" size={24} color={appColors.UW_Purple} />
              </View>
            </Card.Header>
            <Card.Content>
              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => navigation.navigate('EditUsername')}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="person-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Username</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => navigation.navigate('ProfileViewEditMode')}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="create-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Edit Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => Alert.alert("Privacy Settings", "Privacy settings will be available in the next update.")}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="lock-closed-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Privacy</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* Preferences Section */}
          <Card variant="default" style={styles.sectionCard}>
            <Card.Header>
              <View style={styles.sectionHeader}>
                <Card.Title>Preferences</Card.Title>
                <Ionicons name="options-outline" size={24} color={appColors.UW_Purple} />
              </View>
            </Card.Header>
            <Card.Content>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemContent}>
                  <Ionicons name={darkMode ? "moon" : "moon-outline"} size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Dark Mode</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggle, darkMode && styles.toggleActive]}
                  onPress={toggleDarkMode}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleHandle, darkMode && styles.toggleHandleActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingsItem}>
                <View style={styles.settingsItemContent}>
                  <Ionicons name="globe-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Language</Text>
                </View>
                <TouchableOpacity
                  style={styles.languageSelector}
                  onPress={handleLanguageChange}
                >
                  <Text style={styles.languageValue}>{language}</Text>
                  <Ionicons name="chevron-forward" size={18} color={appColors.Grey_600} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => Alert.alert("Notifications", "Notification settings will be available in the next update.")}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="notifications-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Notifications</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* Information Section */}
          <Card variant="default" style={styles.sectionCard}>
            <Card.Header>
              <View style={styles.sectionHeader}>
                <Card.Title>Information</Card.Title>
                <Ionicons name="information-circle-outline" size={24} color={appColors.UW_Purple} />
              </View>
            </Card.Header>
            <Card.Content>
              <TouchableOpacity
                style={styles.settingsItem}
                onPress={handleHelpAndSupport}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="help-circle-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={handleTermsOfService}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="document-text-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Terms of Service</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={handlePrivacyPolicy}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name="shield-checkmark-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={appColors.Grey_600} />
              </TouchableOpacity>

              <View style={styles.settingsItem}>
                <View style={styles.settingsItemContent}>
                  <Ionicons name="information-outline" size={22} color={appColors.Dark_Grey} />
                  <Text style={styles.settingsItemLabel}>App Version</Text>
                </View>
                <Text style={styles.versionText}>1.0.0</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <AppButton
              variant="destructive"
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              Log Out
            </AppButton>
          </View>

          <Text style={styles.footerText}>Friend-ly © {new Date().getFullYear()}</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Using an 8-point spacing system for consistency
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
  },
  content: {
    flex: 1,
  },
  sectionCard: {
    marginBottom: spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemLabel: {
    fontSize: 16,
    color: appColors.Dark_Grey,
    marginLeft: spacing.m,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: appColors.UW_Purple,
  },
  toggleHandle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    transform: [{ translateX: 0 }],
  },
  toggleHandleActive: {
    transform: [{ translateX: 20 }],
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: 8,
  },
  languageValue: {
    marginRight: spacing.s,
    color: appColors.Dark_Grey,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
    color: appColors.Grey_600,
  },
  logoutContainer: {
    marginVertical: spacing.l,
    alignItems: 'center',
  },
  logoutButton: {
    width: '80%',
    backgroundColor: '#f44336',
  },
  footerText: {
    textAlign: 'center',
    color: appColors.Grey_600,
    fontSize: 12,
    marginBottom: spacing.xl,
  }
});

export default SettingsView;