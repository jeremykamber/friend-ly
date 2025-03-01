import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import appColors from '../common/app-colors';

const ProfileButton = ({text, onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: appColors.UW_Purple,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500'
    },
});

export default ProfileButton;