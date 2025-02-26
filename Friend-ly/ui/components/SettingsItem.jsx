import React from "react";
import { View, Text, Switch, Pressable, StyleSheet, Platform, Animated } from "react-native";
import appColors from "../common/app-colors";
import { Ionicons } from "@expo/vector-icons";

/**
 * SettingsItem renders a single setting option with various interaction types:
 * - navigate: Shows a chevron and navigates on press
 * - toggle: Shows a switch component
 * - dropdown: Shows current value and handles selection
 */
const SettingsItem = ({ label, type, value, onToggle, options, onPress, isLast }) => {
  const animatedScale = new Animated.Value(1);

  const handlePressIn = () => {
    if (type === 'toggle') return;
    Animated.spring(animatedScale, {
      toValue: 0.98,
      speed: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (type === 'toggle') return;
    Animated.spring(animatedScale, {
      toValue: 1,
      speed: 100,
      useNativeDriver: true,
    }).start();
  };

  const renderRightElement = () => {
    switch (type) {
      case "toggle":
        return (
          <Switch
            value={value === 'dark'}
            onValueChange={onToggle}
            trackColor={{
              false: Platform.select({
                ios: appColors.Grey_100,
                android: `${appColors.Grey_600}40`
              }),
              true: `${appColors.UW_Purple}80`
            }}
            thumbColor={Platform.select({
              ios: '#fff',
              android: value === 'dark' ? appColors.UW_Purple : '#fff'
            })}
            ios_backgroundColor={appColors.Grey_100}
          />
        );
      case "dropdown":
        return (
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownValue}>{value}</Text>
            <Ionicons
              name={Platform.select({
                ios: "chevron-forward",
                android: "chevron-down"
              })}
              size={20}
              color={appColors.Grey_600}
            />
          </View>
        );
      case "navigate":
        return (
          <Ionicons
            name={Platform.select({
              ios: "chevron-forward",
              android: "arrow-forward"
            })}
            size={20}
            color={appColors.Grey_600}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={type !== 'toggle' ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={type !== 'toggle' ? {
        color: `${appColors.Grey_600}20`,
      } : undefined}
    >
      <Animated.View style={[
        styles.container,
        isLast && styles.lastItem,
        { transform: [{ scale: animatedScale }] }
      ]}>
        <Text style={styles.label}>{label}</Text>
        {renderRightElement()}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.select({
      ios: 14,
      android: 16
    }),
    backgroundColor: appColors.White,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: appColors.Grey_100,
    minHeight: Platform.select({
      ios: 52,
      android: 56
    }),
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: Platform.select({
      ios: 16,
      android: 15
    }),
    color: appColors.Dark_Grey,
    flex: 1,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownValue: {
    fontSize: Platform.select({
      ios: 16,
      android: 15
    }),
    color: appColors.Grey_600,
    marginRight: 4,
  },
});

export default SettingsItem;