import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import appColors from '../common/app-colors';

const ProfilePictureView = () => {
    const [profileImage, setProfileImage] = useState(null);
    const navigation = useNavigation();
    const {setImageUri} = useProfileViewStore();

    const pickImageFromGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Permission to access your gallery is needed!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Permission to access your camera is needed!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleConfirm = () => {
        Alert.alert('Profile Picture Set', 'Your profile picture has been successfully updated!');
        setImageUri(profileImage);
        navigation.navigate('ClassesView');
    };

    const handleSkip = () => {
        Alert.alert('Skipped', 'You can always update your profile picture later.');
        navigation.navigate('ClassesView');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Set Your Profile Picture</Text>
                <Text style={styles.subtitle}>Choose a picture that represents you!</Text>
                
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
                        <Text style={styles.buttonText}>Upload from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <Text style={styles.buttonText}>Take a Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.endButtonContainer}>            
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                >
                    <Text style={styles.actionButtonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    disabled={!profileImage}
                >
                    <Text style={styles.actionButtonText}>Confirm</Text>
                </TouchableOpacity>    
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    placeholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    placeholderText: {
        color: '#888',
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#000000',
        marginTop: 10,
    },
    buttonContainer: {
        justifyContent: 'center',
        width: '100%',
        marginBottom: 30,
        marginTop: 30,
    },
    button: {
        backgroundColor: appColors.UW_Purple, // Purple shade for the main buttons
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25, // Rounded corners for a sleek look
        marginHorizontal: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Adds shadow for Android
        borderWidth: 1,
        borderColor: '#5A4FCF', // Border in a darker purple tone
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF', // White text for contrast
        fontWeight: '400',
        fontSize: 16,
        textTransform: 'uppercase', // Makes the text stylish and consistent
        textAlign: 'center',
    },
    endButtonContainer: {
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
    },
    confirmButton: {
        backgroundColor: '#92BBD1', // Softer purple for action buttons
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#5A91AC',
        marginBottom: 20,
        width: 120,
    },
    skipButton: {
        backgroundColor: appColors.Grey_600,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginLeft: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#5A5A5A',
        marginBottom: 20,
        width: 120,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 16,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
});

export default ProfilePictureView;