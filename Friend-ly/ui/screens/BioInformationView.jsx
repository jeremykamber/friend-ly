import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import { useNavigation } from '@react-navigation/native';
import appColors from '../common/app-colors';
import { Picker } from '@react-native-picker/picker';

const BioInformationView = () => {
    const {setName, setMajorAndYear, setAboutMe} = useProfileViewStore();
    const navigation = useNavigation();

    const [tempName, setTempName] = useState('');
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        // save the values in the zustand store
        setName(tempName);
        setMajorAndYear(major + " \'" + gradYear.slice(-2));
        setAboutMe(description);
        // inform user that their profile has been updated
        Alert.alert('Profile Saved!', `Name: ${tempName}\nMajor: ${major}\nGraduation Year: ${gradYear}\nDescription: ${description}`);
        navigation.navigate("ProfilePictureView");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Your Profile</Text>
        
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={tempName}
                onChangeText={(text) => setTempName(text)}
            />

            <Text style={styles.label}>Major</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your major"
                value={major}
                onChangeText={(text) => setMajor(text)}
            />
            
            <Text style={styles.label}>Graduation Year</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={gradYear}
                    onValueChange={(value) => setGradYear(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select your graduation year" value="" />
                    {Array.from({ length: 15 }, (_, i) => 2020 + i).map((year) => (
                        <Picker.Item label={`${year}`} value={`${year}`} key={year} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Short Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write a short description for your bio"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={(text) => setDescription(text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    pickerContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
    },
    picker: {
        width: '100%',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: appColors.UW_Purple,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BioInformationView;
