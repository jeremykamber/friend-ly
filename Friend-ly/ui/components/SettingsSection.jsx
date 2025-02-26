import React from "react";
import { View, Text, StyleSheet } from "react-native";
import appColors from "../common/app-colors";

/**
 * SettingsSection component renders a grouped section of settings items
 * with a title and consistent mobile-native styling
 */
const SettingsSection = ({ title, children }) => {
  const childArray = React.Children.toArray(children);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.container}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            isLast: index === childArray.length - 1
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    color: appColors.Grey_600,
    marginBottom: 8,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  container: {
    backgroundColor: appColors.White,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.Grey_100,
  },
});

export default SettingsSection;