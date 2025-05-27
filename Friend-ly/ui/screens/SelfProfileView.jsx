import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
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
import AddPosts from '../components/AddPosts';

const SelfProfileView = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const fetchData = useProfileViewStore(state => state.fetchData);
  const { name, imageUri, majorAndYear, aboutMe, interests, currentClasses, posts } = useProfileViewStore();
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch profile data when the component mounts
    fetchData();

    // Animate the content in when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, fetchData]);

  const handleEdit = () => {
    navigation.navigate('ProfileViewEditMode');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  }, [fetchData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={appColors.White} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Profile Header Section */}
          <Card variant="shadow" style={styles.profileCard}>
            <View style={styles.profileHeaderContent}>
              <View style={styles.profilePictureContainer}>
                <DisplayProfilePhoto imageUri={imageUri} />
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={handleEdit}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil" size={18} color={appColors.White} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfoContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.majorText}>{majorAndYear}</Text>

                <TouchableOpacity
                  style={styles.editFullProfileButton}
                  onPress={handleEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                  <Ionicons name="chevron-forward" size={16} color={appColors.UW_Purple} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* About Me Section */}
          <Card variant="default" style={styles.sectionCard}>
            <Card.Header>
              <Card.Title>About Me</Card.Title>
            </Card.Header>
            <Card.Content>
              <Text style={styles.aboutMeText}>{aboutMe || "No bio added yet."}</Text>
            </Card.Content>
          </Card>

          {/* Interests Section */}
          <Card variant="default" style={styles.sectionCard}>
            <Card.Header>
              <Card.Title>Interests</Card.Title>
            </Card.Header>
            <Card.Content>
              {interests && interests.length > 0 ? (
                <View style={styles.interestsContainer}>
                  {interests.map((interest, index) => (
                    <View key={index} style={styles.interestChip}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyStateText}>No interests added yet.</Text>
              )}
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

          {/* Posts Section */}
          <Card variant="default" style={styles.postsCard}>
            <Card.Header style={styles.postsHeader}>
              <Card.Title>Posts</Card.Title>
              <AddPosts></AddPosts>
            </Card.Header>
            <Card.Content style={styles.postsContent}>
              {posts && posts.length > 0 ? (
                posts.map((item, index) => (

                  <PostItem
                    key={item.id || index}
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
                ))
              ) : (
                <Card variant="glass" style={styles.emptyPostCard}>
                  <Card.Content style={styles.emptyPostsContainer}>
                    <Ionicons name="images-outline" size={48} color={appColors.Grey_600} />
                    <Text style={styles.emptyStateText}>No posts yet.</Text>
                    <Text style={styles.emptyStateSubtext}>Share something with your friends!</Text>
                  </Card.Content>
                </Card>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: appColors.Grey_100,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.Dark_Grey,
  },
  container: {
    flex: 1,

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
    position: 'relative',
    marginRight: spacing.m,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    backgroundColor: appColors.UW_Purple,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: appColors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
  editFullProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    borderRadius: 8,
    backgroundColor: '#F2F0F7', // Light purple background
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.UW_Purple,
    marginRight: spacing.xs,
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
    marginHorizontal: -spacing.xs, // To offset padding of interest chips
  },
  interestChip: {
    backgroundColor: '#EAE5F7', // Light purple for chips, derived from UW_Purple
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: '#D5CCEB', // Slightly darker border
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
    padding: 0,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
  },
  addPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
  },
  addPostText: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.UW_Purple,
    marginLeft: spacing.xs,
  },
  postsContent: {
    paddingVertical: spacing.m,
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
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.Grey_600,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: appColors.Grey_600,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default SelfProfileView;