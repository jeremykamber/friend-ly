import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Text, ActivityIndicator, Image } from 'react-native';
import AddPosts from '../components/AddPosts';
import backendMock from '../mocks/backendMock';
import UserAvatar2 from '../components/UserAvatar2';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import PostCard from '../components/PostCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeView = () => {

    const {imageUri, name, posts} = useProfileViewStore();
    const [userInfo, setUserInfo] = useState([]);  // Stores all user info
    const [loading, setLoading] = useState(true);   // Indicates if data is being fetched
    const [error, setError] = useState(null);

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
                <Text style={{fontSize: 18}}>{name}</Text>
                <AddPosts></AddPosts>
            </View>

            <View style={{ flex: 1, paddingTop: 20, paddingBottom: 5, borderBottomWidth: 1 }}>
                <FlatList
                    horizontal={true}
                    data={userInfo}
                    keyExtractor={(item, index) => item?.user_id?.toString() || index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 20, flexDirection:'row', flexWrap:'wrap' }}>
                            {item ? (
                                <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center'}}>
                                    <UserAvatar2 username={item[0].username} picture={item[0].profile_picture}></UserAvatar2>
                                </View>
                            ) : (
                                <Text>User information not found</Text>
                            )}
                        </View>
                    )}
                />
                
                
            </View>

            {/* REPLACE CODE BELOW TO SHOW POSTS FROM FRIENDS NOT OWN POSTS */}
            <View style={{paddingTop: 10}}>
                <FlatList
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
            </View>

            
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
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    headerPicture: {
        width: 70,
        height: 70,
        marginHorizontal: 20,
    },
});

export default HomeView;