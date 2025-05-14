import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import ProfileButton from '../components/ProfileButton';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import { useNavigation } from '@react-navigation/native';
import DisplayProfilePhoto from '../components/DisplayProfilePhoto';
import PostCard from '../components/PostCard';


const ProfileView = () => {
    // VARIABLES BELOW SHOULD STORE INFO OF USER WHO'S PROFILE IT IS (NOT USER WHO'S LOGGED IN)
    const {imageUri, name, majorAndYear, aboutMe, interests, currentClasses, posts} = useProfileViewStore();

    const navigation = useNavigation();
    const {test} = useParams();

    const handleFollow = () => {
        navigation.navigate('ProfileViewEditMode'); // ADD FOLLOW FUNCTIONALITY
    };

    const handleMessage = () => {
        navigation.navigate('ChatsView'); // CHANGE THIS TO GO TO DM IF YOU ARE FOLLOWING PERSON
    };

    return (
        <ScrollView style={styles.container}>

            <View style={styles.profilePictureHeader}>
                <View style={styles.profilePictureEdit}>
                    <DisplayProfilePhoto imageUri={imageUri} />
                </View>
            </View>

            <View style={styles.profileInfoHeader}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.major}>{majorAndYear}</Text>

                <View style={styles.buttonContainer}>
                    {/* CHANGE THE CODE BELOW TO SAY FOLLOW, UNFOLLOW, OR REQUESTED DEPENDING ON CIRCUMSTANCE */}
                    <ProfileButton text="Follow" onPress={handleFollow}></ProfileButton>
                    {/* MESSAGE SHOULD BE GREYED OUT IF THE USER ISN'T FOLLOWING THEM YET */}
                    <ProfileButton text="Message" onPress={handleMessage}></ProfileButton>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <View style={styles.aboutMeBox}>
                <Text style={styles.aboutMe}>{aboutMe}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.interestsContainer}>
                {interests.map((interest, index) => (
                    <View key={index} style={styles.interestBox}>
                    <Text style={styles.interestText}>{interest}</Text>
                    </View>
                ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Classes</Text>
                <View style={styles.list}>
                {currentClasses.map((classItem, index) => (
                    <View key={index} style={styles.classItem}>
                        <Text key={index} style={styles.listItem}>{classItem.code} - {classItem.name}</Text>
                        {index !== currentClasses.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Posts</Text>
                { posts.map((item, index) => (
                    <View key={index}>
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
                    </View>
                ))}
                
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
        backgroundColor: '#DEDEDE',
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    aboutMe: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    interestBox: {
        backgroundColor: '#E6E6FA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#635687',
        borderWidth: 1,
    },
    interestText: {
        fontSize: 14,
        color: '#635687',
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
        borderBottomColor: '#DEDEDE',
        marginTop: 5,
        marginBottom: 8,
    },
});

export default ProfileView;