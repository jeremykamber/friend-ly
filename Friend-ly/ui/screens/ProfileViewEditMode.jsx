import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import ProfileButton from '../components/ProfileButton';
import InputProfilePhotoButton from '../components/InputProfilePhotoButton';
import EditInterestsButton from '../components/EditInterestsButton';
import EditClassesButton from '../components/EditClassesButton';
import DisplayProfilePhoto from '../components/DisplayProfilePhoto';
import PostCard from '../components/PostCard';
import { useNavigation } from '@react-navigation/native';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import appColors from '../common/app-colors';
import * as SecureStore from 'expo-secure-store'


const ProfileViewEditMode = () => {
    const fetchData = useProfileViewStore(state => state.fetchData);

    useEffect(() => {
        fetchData(); // Fetch profile data every time this screen mounts
    }, [fetchData]);

    //const {name, imageUri, majorAndYear, aboutMe, interests, currentClasses, posts} = useProfileViewStore();

    const {imageUri, setImageUri, name, setName, majorAndYear, setMajorAndYear, aboutMe, 
            setAboutMe, interests, currentClasses, posts, setPosts} = useProfileViewStore();
    const [tempName, setTempName] = useState(name);
    const [tempMajorAndYear, setTempMajorAndYear] = useState(majorAndYear);
    const [tempAboutMe, setTempAboutMe] = useState(aboutMe);
    const [tempPosts, setTempPosts] = useState(posts);

    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [postIndex, setPostIndex] = useState(null);
    const [token, setToken] = useState(null)

    useEffect(() => {
        const getToken = async() => {
            try {
                const result = await SecureStore.getItemAsync("JWT") // jwt token
                result ? setToken(result) : console.log("No token found!")
            } catch (err) {
                throw err
            }
        }
        getToken()
    }, [])

    const handleImageSelected = (uri) => {
        setImageUri(uri);
    };

    // save all information
    const handleSave = async () => {
        
        setName(tempName);
        setMajorAndYear(tempMajorAndYear);
        setAboutMe(tempAboutMe);
        //setPosts(tempPosts);
        

        let body = {
          name: tempName,
          bio: tempAboutMe
        }

        try {
            const token = await SecureStore.getItemAsync("JWT") // jwt token
            if (!token) {
                console.log("No token found!");
                return;
            }
            const response = await fetch("http://localhost:8000/users/updateInfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token, user_info: body })
            });
            navigation.navigate('SelfProfileView');
        } catch (err) {
            throw(err);
        }
    };

    const handleEditInterests = () => {
        navigation.navigate('InterestSelectionView');
    };

    const handleEditClasses = () => {
        navigation.navigate('ClassesView');
    };

    const confirmDelete = (index) => {
        setModalVisible(true);
        setPostIndex(index)
    };

    const handleRemovePost = async () => {
        setTempPosts((tempPosts) => tempPosts.filter((post) => post.post_id !== postIndex));
        setModalVisible(false);
        try {
          const response = await fetch("http://localhost:8000/posts/deletePost", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token, post_id: postIndex})
          })
          console.log(response)
          handleSave()
        } catch (err) {
          throw (err);
        }

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
                { tempPosts.map((item, index) => (
                    <View key={index} style={styles.postsContainer}>
                      <PostCard
                          user={{
                              username: name,
                              profilePic: imageUri,
                          }}
                          timestamp={item.timestamp}
                          image={item.image}
                          caption={item.caption}
                          likes={item.likes}
                          comments={item.comments}
                      />
                      <TouchableOpacity onPress={() => confirmDelete(item.post_id)} style={styles.removeButton}>
                          <Text style={styles.removeButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                ))}

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)} >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Are you sure you want to delete this post?</Text>
                            <View style={styles.confirmationButtonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)} >
                                    <Text style={styles.confirmationButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.deleteButton]}
                                    onPress={() => handleRemovePost()} >
                                    <Text style={styles.confirmationButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            

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
  removeButton: {
    backgroundColor: '#c0392b',
    paddingHorizontal: 8,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    right: 35,
  },
  removeButtonText: {
    color: appColors.White,
    fontSize: 16,
    fontWeight: '80%',
  },
  postsContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // For Android shadow
  },
  modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
  },
  confirmationButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
  },
  modalButton: {
      flex: 1,
      paddingVertical: 10,
      marginHorizontal: 5,
      borderRadius: 5,
      alignItems: 'center',
  },
  cancelButton: {
      backgroundColor: '#aaa', // Grey color for cancel button
  },
  deleteButton: {
      backgroundColor: '#C0392B', // Muted red for delete button
  },
  comfirmationButtonText: {
      color: 'white',
      fontWeight: 'bold',
  },
});

export default ProfileViewEditMode;