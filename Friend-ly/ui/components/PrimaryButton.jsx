import React from "react";
import { TouchableOpacity, Text } from "react-native";
import appColors from "../common/app-colors";
//import { styled } from "nativewind";

//const StyledTouchableOpacity = styled(TouchableOpacity);

const PrimaryButton = ({
    text,
    onPress,
    width = 180,
    height = 60,
    color = appColors.UW_Purple,
    style, // External style prop
}) => {

    return (
        <TouchableOpacity
        //<StyledTouchableOpacity
            className={`justify-center items-center my-2.5
        w-[${width}px] h-[${height}px]
        bg-[${color}]
        rounded-[${Math.floor(height / 2)}px] shadow-lg`}
            //style={[shadowStyle, style]} // Apply shadow styles and any external styles.
            // The `styled` HOC merges className and style props.
            onPress={onPress}
        >
            <Text className={`text-white text-base font-bold`}>{text}</Text>
        </TouchableOpacity>
    );
};

// The StyleSheet.create block is no longer needed and has been removed.

export default PrimaryButton;
