import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import ProfileButton from '../components/ProfileButton';
import InputProfilePhotoButton from '../components/InputProfilePhotoButton';
import EditInterestsButton from '../components/EditInterestsButton';
import EditClassesButton from '../components/EditClassesButton';
import DisplayProfilePhoto from '../components/DisplayProfilePhoto';
import { useNavigation } from '@react-navigation/native';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';


const ProfileViewEditMode = () => {

    const {imageUri, setImageUri, name, setName, majorAndYear, setMajorAndYear, aboutMe, setAboutMe, interests, currentClasses} = useProfileViewStore();
    const [tempName, setTempName] = useState(name);
    const [tempMajorAndYear, setTempMajorAndYear] = useState(majorAndYear);
    const [tempAboutMe, setTempAboutMe] = useState(aboutMe);

    const navigation = useNavigation();

    const handleImageSelected = (uri) => {
        setImageUri(uri);
    };

    // save all information
    const handleSave = () => {
        setName(tempName);
        setMajorAndYear(tempMajorAndYear);
        setAboutMe(tempAboutMe);
        
        navigation.navigate('SelfProfileView');
    };

    const handleEditInterests = () => {
        navigation.navigate('InterestSelectionView');
    };

    const handleEditClasses = () => {
        navigation.navigate('ClassesView');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Create profile header (picture, name, major/graduation year, follow/message buttons */}
            <View style={styles.profilePictureHeader}>
                <View style={styles.profilePictureEdit}>
                    <DisplayProfilePhoto imageUri={imageUri} />
                    <InputProfilePhotoButton onImageSelected={handleImageSelected} />
                </View>
            </View>

            <View style={styles.profileInfoHeader}>
                <TextInput style={styles.name} onChangeText={setTempName}>{tempName}</TextInput>
                <TextInput style={styles.major} onChangeText={setTempMajorAndYear}>{tempMajorAndYear}</TextInput>

                <View style={styles.buttonContainer}>
                    <ProfileButton text="Save" onPress={handleSave}></ProfileButton>
                </View>
            </View>

            {/* Create About Me section (text) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <View style={styles.aboutMeBox}>
                    <TextInput 
                        style={styles.aboutMe} 
                        multiline={true}
                        onChangeText={setTempAboutMe}>{tempAboutMe}
                    </TextInput>
                </View>
            </View>

            {/* Create Interests section (interests displayed as list) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <EditInterestsButton onPress={handleEditInterests}></EditInterestsButton>
                <View style={styles.interestsContainer}>
                {interests.map((interest, index) => (
                    <View key={index} style={styles.interestBox}>
                    <Text style={styles.interestText}>{interest}</Text>
                    </View>
                ))}
                </View>
            </View>

            {/* Create Classes section (classes displayed as list) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Classes</Text>
                <EditClassesButton onPress={handleEditClasses}></EditClassesButton>
                <View style={styles.list}>
                {currentClasses.map((classItem, index) => (
                    <View key={index} style={styles.classItem}>
                        <Text key={index} style={styles.listItem}>{classItem.code} - {classItem.name}</Text>
                        {index !== currentClasses.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
                </View>
            </View>

            {/* Create Posts section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Posts</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  profilePictureHeader: {
    alignItems: 'center',
    marginBottom: 0,
  },
  profilePictureEdit: {
    position: 'relative',
  },
  profileInfoHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  major: {
    fontSize: 18,
    color: '#7f7f7f',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  aboutMeBox: {
    backgroundColor: '#DEDEDE', // Light grey background
    borderRadius: 8, // Rounded corners
    padding: 16, // Padding inside the box
    marginTop: 8, // Some space between the title and box
  },
  aboutMe: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row', // Align items horizontally
    flexWrap: 'wrap', // Allow wrapping to next line if needed
    gap: 8, // Space between each interest box
    marginTop: 8, // Some space between section title and interest boxes
  },
  interestBox: {
    backgroundColor: '#E6E6FA', // Light purple background
    borderRadius: 8, // Rounded corners
    paddingHorizontal: 12, // Padding inside the box
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#635687',
    borderWidth: 1,
  },
  interestText: {
    fontSize: 14,
    color: '#635687', // Purple color for text
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DEDEDE', // Light gray color for the border
    marginTop: 5,
    marginBottom: 8,
  },
});

export default ProfileViewEditMode;