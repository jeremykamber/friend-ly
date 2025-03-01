import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import appColors from '../common/app-colors';

const InterestSubmitButton = ({text, onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#333333',
        borderRadius: 5,
        marginBottom: 40,
        marginLeft: 30,
        marginRight: 30,
        alignItems: 'center',
        paddingVertical: 10,
    },
    buttonText: {
        color: appColors.White,
        fontSize: 20,

    },
});

export default InterestSubmitButton;