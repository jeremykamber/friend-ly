import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import backendMock from '../mocks/backendMock';
import UserAvatar2 from '../components/UserAvatar2';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import appColors from '../common/app-colors';

const PeopleView = () => {

    const {friends, setFriends} = useProfileViewStore();

    const [userInfo, setUserInfo] = useState([]);  // Stores all user info
    const [loading, setLoading] = useState(true);   // Indicates if data is being fetched
    const [error, setError] = useState(null);
    const numColumns = 3;

    // note: all friend request actions use zustand store 
    // while producing friend list at bottom of page uses mock backend
    // const acceptRequest = (id) => {
    //     setFriends((prevFriends) =>
    //         prevFriends.map((req) =>
    //             req.id === id ? { ...req, theyRequestedMe: 'Following' } : req
    //         )
    //     );
    // };
    
    // const deleteRequest = (id) => {
    //     setFriends((prevFriends) =>
    //         prevFriends.map((req) =>
    //             req.id === id ? { ...req, theyRequestedMe: 'Not Following' } : req
    //         )
    //     );
    // };

    // const followBack = (id) => {
    //     setFriends((prevFriends) =>
    //         prevFriends.map((req) =>
    //             req.id === id ? { ...req, iRequestedThem: 'Requested' } : req
    //         )
    //     );
    // };

    const acceptRequest = async (id) => {
        try {
            const result = await SecureStore.getItemAsync("JWT");
            if (!result) return;

            const response = await fetch(`http://localhost:8000/friends/acceptFriendRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id1: id,
                    user_id2: result,
                }),
            });

            if (!response.ok) throw new Error('Failed to accept friend request');

            setFriends((prevFriends) =>
                prevFriends.map((req) =>
                    req.id === id ? { ...req, theyRequestedMe: 'Following' } : req
                )
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    const deleteRequest = async (id) => {
        try {
            const result = await SecureStore.getItemAsync("JWT");
            if (!result) return;

            const response = await fetch(`http://localhost:8000/friends/deleteFriend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id1: id,
                    user_id2: result,
                }),
            });

            if (!response.ok) throw new Error('Failed to delete friend request');

            setFriends((prevFriends) =>
                prevFriends.map((req) =>
                    req.id === id ? { ...req, theyRequestedMe: 'Not Following' } : req
                )
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    const followBack = async (id) => {
        const result = await SecureStore.getItemAsync("JWT");
        if (!result) return;

        try {
            const response = await fetch(`http://localhost:8000/friends/sendFriendRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id1: result,
                    user_id2: id,
                }),
            });

            if (!response.ok) throw new Error('Failed to follow back');

            setFriends((prevFriends) =>
                prevFriends.map((req) =>
                    req.id === id ? { ...req, iRequestedThem: 'Requested' } : req
                )
            );
        } catch (err) {
            console.error(err.message);
        }
    };


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
        <ScrollView style={styles.container}>

            
            <Text style={styles.requestsHeader}>Follow Requests</Text>
            

            <FlatList
                data={friends.filter(friend => friend.theyRequestedMe === 'Requested')}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.friendCard} key={index}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />

                        <Text style={styles.name}>{item.name}</Text>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.acceptButton} onPress={() => acceptRequest(item.id)}>
                                <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[
                                styles.statusButton,
                                item.iRequestedThem === 'Not Following'
                                    ? styles.statusButtonActive
                                    : styles.statusButtonInactive ]}
                                disabled={item.iRequestedThem !== 'Not Following'}
                                onPress={() => {
                                    if (item.iRequestedThem === 'Not Following') {
                                        followBack(item.id);
                                    }
                                }}
                        >
                            <Text style={styles.buttonText}>
                                {item.iRequestedThem === 'Not Following'
                                    ? 'Follow Back'
                                    : item.iRequestedThem}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRequest(item.id)}>
                            <Text style={styles.deleteText}>✖</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.container}
            />

            <View style={styles.line}></View>
            <Text style={styles.friendsHeader}>Friends</Text>

            <FlatList
                style={{ flex: 1, paddingTop: 20, paddingBottom: 3}}
                data={userInfo}
                scrollEnabled={false}
                numColumns={numColumns}
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
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20, 
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    headerPicture: {
        width: 60,
        height: 60,
        marginHorizontal: 20,
        borderRadius: 75,
    },
    friendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15,
        borderRadius: 12,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        marginHorizontal: 25,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: appColors.UW_Purple,
        paddingVertical: 3,
        alignItems: 'center',
        borderRadius: 5,
        width: 70,
        height: 30,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#333333',
    },
    statusButton: {
        paddingVertical: 4,
        borderRadius: 5,
        marginRight: 8,
        width: 100,
        height: 30,
        alignItems: 'center',
        borderWidth: 1,
    },
    statusButtonActive: {
        backgroundColor: '#5D8AA8',
        borderColor: '#3A5F7A',
    },
    statusButtonInactive: {
        backgroundColor: '#C0C0C0',
        borderColor: '#A9A9A9',
    },
    deleteButton: {
        backgroundColor: '#4A4A4A',
        borderRadius: 5,
        width: 30,
        height: 30,
        padding: 2,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000000',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    deleteText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '100',
    },
    requestsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    friendsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    line: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 30,
        width: '100%',
    },
});

export default PeopleView;