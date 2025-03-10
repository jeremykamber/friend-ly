import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import appColors from '../common/app-colors';

const DisplayProfilePhoto = ({ imageUri }) => {
    return (
        <View>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.profilePicture} />}
        </View>
    );
};

const styles = StyleSheet.create({
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        marginTop: 50,
        borderWidth: 3,
        borderColor: appColors.Black,
      },
});

export default DisplayProfilePhoto;

