import React, { useState, useLayoutEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsSection from "../components/SettingsSection";
import SettingsItem from "../components/SettingsItem";
import appColors from "../common/app-colors";
import { useSettingsStore } from "../stores/settingsStore";

const SettingsView = ({ navigation }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [darkMode, toggleDarkMode] = useSettingsStore(state => [state.darkMode, state.toggleDarkMode]);

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
  }, [navigation]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = () => {
    const languages = ["English", "French", "Spanish"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingsSection title="Account">
          <SettingsItem
            label="Username"
            type="navigate"
            onPress={() => navigation.navigate('EditUsername')}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            label="Dark Mode"
            type="toggle"
            value={darkMode}
            onToggle={toggleDarkMode}
          />
          <SettingsItem
            label="Language"
            type="dropdown"
            value={language}
            onPress={handleLanguageChange}
            options={["English", "French", "Spanish"]}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.White,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
});

export default SettingsView;