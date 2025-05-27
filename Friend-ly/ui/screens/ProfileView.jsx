import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileButton from '../components/ProfileButton';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import { useNavigation } from '@react-navigation/native';
import DisplayProfilePhoto from '../components/DisplayProfilePhoto';
import PostItem from '../components/PostItem';
import { Ionicons } from '@expo/vector-icons';
import appColors from '../common/app-colors';
import Card from '../components/Card';

const ProfileView = ({ route }) => {
    const { profileContent } = route.params || {};
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const [followStatus, setFollowStatus] = useState('Follow'); // 'Follow', 'Following', 'Requested'

    // In a real app, this data would come from the API based on the profile being viewed
    const { imageUri, name, majorAndYear, aboutMe, interests, currentClasses, posts } = useProfileViewStore();
    const navigation = useNavigation();

    useEffect(() => {
        // Animate content in when component mounts
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, scaleAnim]);

    const handleFollow = () => {
        // Toggle follow status in a cycle: Follow -> Requested -> Following -> Follow
        if (followStatus === 'Follow') {
            setFollowStatus('Requested');
        } else if (followStatus === 'Requested') {
            setFollowStatus('Following');
        } else {
            setFollowStatus('Follow');
        }
    };

    const handleMessage = () => {
        // Only navigate to chat if following
        if (followStatus === 'Following') {
            navigation.navigate('ChatsView');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Determine if message button should be enabled
    const isMessageEnabled = followStatus === 'Following';

    return (
        <ScrollView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={appColors.White} />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color={appColors.Dark_Grey} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} /> {/* Empty view for balance */}
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Profile Header Section */}
                    <Card variant="shadow" style={styles.profileCard}>
                        <View style={styles.profileHeaderContent}>
                            <View style={styles.profilePictureContainer}>
                                <DisplayProfilePhoto imageUri={imageUri} />
                            </View>

                            <View style={styles.profileInfoContainer}>
                                <Text style={styles.nameText}>{profileContent?.data?.username ? profileContent.data.username : "No username."}</Text>
                                <Text style={styles.majorText}>{majorAndYear}</Text>

                                <View style={styles.actionButtonsContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.followButton,
                                            followStatus === 'Following' && styles.followingButton,
                                            followStatus === 'Requested' && styles.requestedButton
                                        ]}
                                        onPress={handleFollow}
                                        activeOpacity={0.8}
                                    >
                                        {followStatus === 'Following' && (
                                            <Ionicons name="checkmark" size={16} color={appColors.White} style={styles.buttonIcon} />
                                        )}
                                        <Text style={styles.followButtonText}>{followStatus}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.messageButton,
                                            !isMessageEnabled && styles.disabledButton
                                        ]}
                                        onPress={handleMessage}
                                        disabled={!isMessageEnabled}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name="chatbubble-outline"
                                            size={16}
                                            color={isMessageEnabled ? appColors.Dark_Grey : appColors.Grey_600}
                                            style={styles.buttonIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.messageButtonText,
                                                !isMessageEnabled && styles.disabledButtonText
                                            ]}
                                        >
                                            Message
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* About Me Section */}
                    <Card variant="default" style={styles.sectionCard}>
                        <Card.Header>
                            <Card.Title>About Me</Card.Title>
                        </Card.Header>
                        <Card.Content>
                        <Text style={styles.aboutMeText}>
                            {profileContent?.data?.username ? `Hi, I'm ${profileContent.data.username}!` : 'No bio added yet.'}
                        </Text>
                        </Card.Content>
                    </Card>

                    {/* Interests Section */}
                    <Card variant="default" style={styles.sectionCard}>
                        <Card.Header>
                            <Card.Title>Shared Interests</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            {profileContent?.data?.common_interests ? (profileContent.data.common_interests.length > 0 ? (
                                <View style={styles.interestsContainer}>
                                    {profileContent.data.common_interests.map((interest, index) => (
                                        <View key={index} style={styles.interestChip}>
                                            <Text style={styles.interestText}>{interest}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.emptyStateText}>No shared interests.</Text>
                            )) : <Text style={styles.emptyStateText}>No shared interests.</Text>}
                        </Card.Content>
                    </Card>

                    {/* Current Classes Section */}
                    <Card variant="default" style={styles.sectionCard}>
                        <Card.Header>
                            <Card.Title>Current Classes</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            {currentClasses && currentClasses.length > 0 ? (
                                <View style={styles.classesList}>
                                    {currentClasses.map((classItem, index) => (
                                        <View key={index} style={styles.classItem}>
                                            <Text style={styles.classCode}>{classItem.code}</Text>
                                            <Text style={styles.className}>{classItem.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.emptyStateText}>No classes added yet.</Text>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Posts Section - Only show if following or public profile */}
                    {followStatus === 'Following' && (
                        <Card variant="default" style={styles.postsCard}>
                            <Card.Header>
                                <Card.Title>Posts</Card.Title>
                            </Card.Header>
                            <Card.Content style={styles.postsContent}>
                                {posts && posts.length > 0 ? (
                                    posts.map((item, index) => (
                                        <Card key={index} variant="default" style={styles.postContainer}>
                                            <Card.Content>
                                                <PostItem
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
                                            </Card.Content>
                                        </Card>
                                    ))
                                ) : (
                                    <Card variant="glass" style={styles.emptyPostCard}>
                                        <Card.Content style={styles.emptyPostsContainer}>
                                            <Ionicons name="images-outline" size={48} color={appColors.Grey_600} />
                                            <Text style={styles.emptyStateText}>No posts yet.</Text>
                                        </Card.Content>
                                    </Card>
                                )}
                            </Card.Content>
                        </Card>
                    )}

                    {/* Not following message */}
                    {followStatus !== 'Following' && (
                        <Card variant="glass" style={styles.privateCard}>
                            <Card.Content style={styles.privateContentContainer}>
                                <Ionicons name="lock-closed" size={48} color={appColors.Grey_600} />
                                <Text style={styles.privateContentTitle}>Private Profile</Text>
                                <Text style={styles.privateContentText}>
                                    Follow this user to see their posts and more information.
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                </Animated.View>
            </ScrollView>
        </ScrollView>
    );
};

// Using an 8-point spacing system for consistency
const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: appColors.White,
    },
    header: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: appColors.Grey_100,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: appColors.Dark_Grey,
    },
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7', // Slightly off-white for contrast with cards
    },
    contentContainer: {
        paddingBottom: spacing.xl,
    },
    content: {
        padding: spacing.m,
    },
    profileCard: {
        marginBottom: spacing.m,
    },
    profileHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePictureContainer: {
        marginRight: spacing.m,
    },
    profileInfoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: appColors.Dark_Grey,
        marginBottom: spacing.xs,
    },
    majorText: {
        fontSize: 16,
        color: appColors.Grey_600,
        marginBottom: spacing.m,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    followButton: {
        backgroundColor: appColors.UW_Purple,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: spacing.s,
    },
    followingButton: {
        backgroundColor: '#38A169', // Green for "Following" state
    },
    requestedButton: {
        backgroundColor: '#718096', // Slate for "Requested" state
    },
    buttonIcon: {
        marginRight: 4,
    },
    followButtonText: {
        color: appColors.White,
        fontWeight: '600',
        fontSize: 14,
    },
    messageButton: {
        backgroundColor: '#F2F0F7', // Light purple background
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: spacing.s,
    },
    disabledButton: {
        backgroundColor: '#F5F5F5', // Lighter background for disabled state
    },
    messageButtonText: {
        color: appColors.Dark_Grey,
        fontWeight: '600',
        fontSize: 14,
    },
    disabledButtonText: {
        color: appColors.Grey_600,
    },
    sectionCard: {
        marginBottom: spacing.m,
    },
    aboutMeText: {
        fontSize: 16,
        lineHeight: 24,
        color: appColors.Grey_600,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.xs,
    },
    interestChip: {
        backgroundColor: '#EAE5F7',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: 20,
        margin: spacing.xs,
        borderWidth: 1,
        borderColor: '#D5CCEB',
    },
    interestText: {
        fontSize: 14,
        color: appColors.UW_Purple,
        fontWeight: '500',
    },
    classesList: {
        marginTop: spacing.xs,
    },
    classItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: appColors.Grey_100,
    },
    classCode: {
        fontSize: 15,
        fontWeight: '600',
        color: appColors.UW_Purple,
        marginRight: spacing.s,
        minWidth: 70,
    },
    className: {
        fontSize: 15,
        color: appColors.Dark_Grey,
        flex: 1,
    },
    postsCard: {
        marginBottom: spacing.m,
    },
    postsContent: {
        padding: 0,
    },
    postContainer: {
        marginBottom: spacing.m,
        padding: 0,
        overflow: 'hidden',
    },
    emptyPostCard: {
        marginTop: spacing.m,
    },
    emptyPostsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    privateCard: {
        marginBottom: spacing.m,
    },
    privateContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    privateContentTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: appColors.Dark_Grey,
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    privateContentText: {
        fontSize: 16,
        color: appColors.Grey_600,
        textAlign: 'center',
        lineHeight: 24,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        color: appColors.Grey_600,
        marginTop: spacing.s,
        textAlign: 'center',
    },
});

export default ProfileView;