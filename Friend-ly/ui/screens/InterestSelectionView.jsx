import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import appColors from '../common/app-colors';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import InterestSubmitButton from '../components/InterestSubmitButton';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import { useNavigation } from '@react-navigation/native';

//import Slider from '@react-native-community/slider';


const InterestSelectionView = () => {
  const {interests, setInterests, hasPreviousScreen, setHasPreviousScreen} = useProfileViewStore();

  //const [value, setValue] = useState(''); // Stores current interest
  const [submittedValues, setSubmittedValues] = useState(interests); // Stores all interests
  //const [submittedNums, setSubmittedNums] = useState([]); // Stores all interest levels (numbers)
  //const [sliderValue, setSliderValue] = useState(1); // Stores current slider value

  const navigation = useNavigation();

  // Add/save a new interest and its respective number value
  const handleSubmit = () => {
    //if (value.trim() !== '') {  // Only save non-empty strings
      //setSubmittedValues((prevValues) => [...prevValues, value]);
      //setValue(''); // reset the TextInput box
      //setSubmittedNums((prevValues) => [...prevValues, sliderValue]);
      //setSliderValue(1); // reset the slider
    //}
    setInterests(submittedValues);
    if (hasPreviousScreen) {
        navigation.navigate('ProfileViewEditMode');
    }
    else {
        setHasPreviousScreen(true);
        navigation.navigate('SelfProfileView');
    }
  };

  // Remove an interest (based on its index)
  const handleRemove = (index) => {
    setSubmittedValues((prevValues) => prevValues.filter((_, i) => i !== index));
    //setSubmittedNums((prevValues) => prevValues.filter((_, i) => i !== index));
  };

  const handleSelectionChange = (newInterestList) => {
      setSubmittedValues(newInterestList);
  };

  return (

    <SafeAreaView style={styles.broadContainer}>
        <View style={styles.container}>
          <Text style={ {fontSize: 20, marginBottom: 40}}>My Interests</Text>
          {/* User can type in their interests */}
          {/* <TextInput
            style={styles.input}
            placeholder="Input interests here..."
            value={value}
            onChangeText={setValue}
          /> */}

          <Text style={styles.heading}>Select your top 10 interests!</Text>
          
          
          {/* Create the slider */}
          { /* <View style={styles.sliderContainer}>
            <Slider
              style = {{width:200, height:40}}
              minimumValue={1}
              maximumValue={10}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#757575"
              thumbTintColor="#4B2E83"
              step={1}
              value={sliderValue}
              onValueChange={(value) => setSliderValue(value)}
            />
            <Text style={styles.sliderText}>{sliderValue}</Text>
          </View>
          */ }

          <MultiSelectDropdown onSelectionChange={handleSelectionChange}></MultiSelectDropdown>

          {/* Display the submitted interests */}
          <View style={styles.valuesContainer}>
            {submittedValues.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                {/*
                <Text style={styles.displayText}>
                  {item},  {submittedNums[index]}
                </Text>
                */}
                <Text style={styles.displayText}>
                  {item}
                </Text>
                {/* Remove button for each interest */}
                {/*
                <TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>x</Text>
                </TouchableOpacity>
                */}
              </View>
            ))}
          </View>

        </View>

        {/* Submit button to add an interest and its respective number value */}
        <View styles={styles.buttonContainer}>
            <InterestSubmitButton text='Done!' onPress={handleSubmit}/>
        </View>

    </SafeAreaView>
  );
};

// Styles for button, slider, text, and interests
const styles = StyleSheet.create({
  broadContainer: {
    flex: 1,
    backgroundColor: appColors.White,
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
    backgroundColor: appColors.Grey_100,
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