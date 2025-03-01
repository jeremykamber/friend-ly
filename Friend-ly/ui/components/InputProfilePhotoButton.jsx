import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import appColors from '../common/app-colors';

const InputProfilePhotoButton = ({onImageSelected}) => {
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onImageSelected(result.assets[0].uri)
        }
    };

    return (
        <View style={styles.button}>
            <TouchableOpacity style={styles.circle} onPress={pickImage}>
                <Ionicons name="camera-outline" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        position: 'absolute',
        top: 130,
        left: 80,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderColor: appColors.Black,
        borderWidth: 2,
        backgroundColor: '#d3d3d3',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default InputProfilePhotoButton;