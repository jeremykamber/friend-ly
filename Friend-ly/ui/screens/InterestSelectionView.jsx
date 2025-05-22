import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import appColors from '../common/app-colors';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import InterestSubmitButton from '../components/InterestSubmitButton';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { useNavigation } from '@react-navigation/native';


const InterestSelectionView = () => {
  const { interests, setInterests, hasPreviousScreen, setHasPreviousScreen } = useProfileViewStore();
  const [submittedValues, setSubmittedValues] = useState(interests); // stores selected interests

  const navigation = useNavigation();

  // add/save a new interest
  const handleSubmit = () => {
    setInterests(submittedValues);
    if (hasPreviousScreen) {
      navigation.navigate('ProfileViewEditMode');
    }
    else {
      setHasPreviousScreen(true);
      navigation.navigate('TabNavigator');
    }
  };

  // remove an interest (based on its index in submittedValues)
  const handleRemove = (index) => {
    setSubmittedValues((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  const handleSelectionChange = (newInterestList) => {
    setSubmittedValues(newInterestList);
  };

  return (

    <SafeAreaView style={styles.broadContainer}>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, marginBottom: 40 }}>My Interests</Text>

        <Text style={styles.heading}>Select your top 10 interests!</Text>

        <MultiSelectDropdown onSelectionChange={handleSelectionChange} selectedInterests={submittedValues} setSelectedInterests={setSubmittedValues}></MultiSelectDropdown>

        {/* Display the submitted interests */}
        <View style={styles.valuesContainer}>
          {submittedValues.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.displayText}>
                {item}
              </Text>
              {/* Remove button for each interest */}
              <TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Submit button to add an interest and its respective number value */}
      <View styles={styles.buttonContainer}>
        <InterestSubmitButton text='Done!' onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

// styles for button, slider, text, and interests
const styles = StyleSheet.create({
  broadContainer: {
    flex: 1,
    backgroundColor: appColors.White,
    marginTop: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: appColors.White,
    padding: 20,
  },
  heading: {
    fontSize: 17,
    marginBottom: 10,
    marginTop: -20,
    color: '#636363',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 0,
    borderRadius: 40,
    paddingLeft: 20,
    marginBottom: 20,
    backgroundColor: appColors.White,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: appColors.UW_Purple,
    margin: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayText: {
    fontSize: 16,
    color: appColors.White,
    marginHorizontal: 8,
  },
  removeButton: {
    backgroundColor: '#9370DB',
    paddingHorizontal: 7,
    paddingVertical: 0,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: appColors.White,
    fontSize: 18,
    fontWeight: '80%',
  },
  sliderText: {
    fontSize: 18,
    color: appColors.Black,
    textAlign: 'center',
    paddingTop: 5,
    paddingLeft: 15,
  },
  sliderContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default InterestSelectionView;