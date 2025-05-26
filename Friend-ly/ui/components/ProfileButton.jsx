import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import appColors from '../common/app-colors';
import AppButton from './AppButton';

const ProfileButton = ({text, onPress}) => {
    return (
        <AppButton variant='default' onPress={onPress}>
            {text}
        </AppButton>
    );
};
export default ProfileButton;