import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import allInterests from '../common/allInterests';  // Import the interests list
import appColors from '../common/app-colors';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';

const MultiSelectDropdown = ({ onSelectionChange }) => {

    const {interests} = useProfileViewStore();

    const [selectedInterests, setSelectedInterests] = useState(interests);
    const [showPicker, setShowPicker] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSelection = (interest) => {
        if (selectedInterests.includes(interest)) {
            const updatedSelections = selectedInterests.filter(i => i !== interest);
            setSelectedInterests(updatedSelections);
            onSelectionChange(updatedSelections);
        }
        else {
            if (selectedInterests.length < 10) {
                const updatedSelections = [...selectedInterests, interest];
                setSelectedInterests(updatedSelections);
                onSelectionChange(updatedSelections);
            }
            else {
                Alert.alert('Selection Limit', 'You can only select up to 10 interests.');
            }
        }
    };

    const filteredInterests = allInterests.filter(interest =>
        interest.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleOutsidePress = () => {
        setShowPicker(false);
        Keyboard.dismiss();  // Dismiss the keyboard
        setIsFocused(false);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.broadContainer}>
                <View style={[styles.container]}>
                    <TextInput
                        placeholder="Search interests..."
                        value={searchText}
                        onChangeText={setSearchText}
                        style={[styles.input, { borderColor: isFocused ? appColors.UW_Purple : appColors.Black }]}
                        onFocus={() => { setShowPicker(true); setIsFocused(true); }}
                        //onBlur={() => setIsFocused(false)}
                    />

                    {showPicker && (
                        <ScrollView style={styles.dropdown}>
                            {filteredInterests.map((interest, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    onPress={() => handleSelection(interest)}
                                >
                                    <Text style={[
                                        styles.dropdownItems, 
                                        selectedInterests.includes(interest) && styles.selectedItem,
                                    ]}>
                                        {interest}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

// Styles for button, slider, text, and interests
const styles = StyleSheet.create({
    input: {
      width: 350,
      height: 50,
      borderWidth: 0,
      borderRadius: 10,
      paddingLeft: 20,
      backgroundColor: appColors.Grey_100,
      fontSize: 15,
      marginBottom: 10,
      borderWidth: 1,
    },
    broadContainer: {
        flex: 1,
        backgroundColor: appColors.White,
    },
    container: {
        flex: 1,
        justifyContent: 'top',
        alignItems: 'center',
        backgroundColor: appColors.White,
        padding: 30,
    },
    dropdown: {
        maxHeight: 300,
        width: 350,
        borderColor: appColors.UW_Purple,
        borderWidth: 1,
        borderRadius: 10,
    },
    dropdownItems: {
        padding: 10,
        paddingLeft: 20,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#d8d9d8',
    },
    selectedItem: {
        backgroundColor: '#e6e6fa',
    },
  });

export default MultiSelectDropdown;