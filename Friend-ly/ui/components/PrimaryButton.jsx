import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import appColors from "../common/app-colors";

const PrimaryButton = ({
    text,
    onPress,
    width = 180,
    height = 60,
    color = appColors.UW_Purple,
    style, // External style prop
}) => {
    const buttonStyle = {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: Math.floor(height / 2),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    };

    const textStyle = {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    };

    return (
        <TouchableOpacity
            style={[buttonStyle, style]} // Apply button styles and any external styles.
            onPress={onPress}
        >
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default PrimaryButton;
