import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Text, ActivityIndicator, Image } from 'react-native';
import AddPosts from '../components/AddPosts';
import backendMock from '../mocks/backendMock';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import PostCard from '../components/PostCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeView = () => {

    /*
    const { getUserInfo } = backendMock;
    const [uI, setUI] = useState(null);

    const fetchUserInfo = async (userId) => {
        try {
            const userInfo = await getUserInfo(userId);
            console.log('User Info:', userInfo);
        } catch (error) {
            console.error('error fetching user info', error);
        }
    };

    fetchUserInfo('1');
    */
    const { imageUri, name, posts, setPosts } = useProfileViewStore();
    const [userInfo, setUserInfo] = useState([]);  // Stores all user info
    const [loading, setLoading] = useState(true);   // Indicates if data is being fetched
    const [error, setError] = useState(null);

    useFocusEffect(
        useCallback(() => {
          const getFriendPosts = async () => {
            try {
              const result = await SecureStore.getItemAsync("JWT");
              if (!result) {
                console.log("No token found.");
                return;
              }
      
              const decoded = jwtDecode(result);
              const userId = decoded.user_id;
      
              const response = await fetch(`http://localhost:8000/posts/getFriendsPost/${userId}`, {
                method: "GET",
              });
      
              const data = await response.json();
              setPosts(data);
            } catch (err) {
              console.error("Error fetching friend posts:", err);
            }
          };
      
          getFriendPosts();
        }, [])
      );


    useEffect(() => {
        const getAllUserInfo = async () => {
            try {
                const userIds = [1, 2, 3, 4];  // IDs of users you want to fetch
                const userPromises = userIds.map(async (userId) => {
                    const userInfo = await backendMock.getUserInfo(userId);
                    return userInfo;  // Resolves the user information or null
                });

                const allUserInfo = await Promise.all(userPromises);
                setUserInfo(allUserInfo);  // Update state with all user info
            } catch (err) {
                setError(err.message);  // Handle errors
            } finally {
                setLoading(false);  // Set loading to false after fetching is done
            }
        };

        getAllUserInfo();
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    {imageUri && <Image source={{ uri: imageUri }} style={styles.headerPicture} />}
                    <Text style={{ fontSize: 18 }}>{name}</Text>
                    <AddPosts></AddPosts>
                </View>

                {/* TODO: REPLACE CODE BELOW TO SHOW POSTS FROM FRIENDS NOT OWN POSTS */}
                <FlatList
                    style={{ paddingTop: 10 }}
                    scrollEnabled={false}
                    data={posts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
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
                    )}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    headerPicture: {
        width: 60,
        height: 60,
        marginHorizontal: 20,
        borderRadius: 75,
    },
});

export default HomeView;