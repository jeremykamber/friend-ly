import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    FlatList,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import backendMock from '../mocks/backendMock';
import UserAvatar2 from '../components/UserAvatar2';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import appColors from '../common/app-colors';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PeopleView = () => {
    const navigation = useNavigation();
    const { friends, setFriends } = useProfileViewStore();
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null)
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

    useFocusEffect(
        useCallback(() => {
            const getAllUserInfo = async () => {
                try {
                    const result = await SecureStore.getItemAsync("JWT") // jwt token
                    if (!result) {
                        console.log("No token found.")
                        return
                    }
                    setToken(result)
                    const response = await fetch("http://localhost:8000/users/getUserID", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: result})
                    })
                    if (!response.ok) {
                        console.log("Getting User ID failed. ")
                        return
                    }
                    const user_id = await response.json()
                    //setUserID(user_id)
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
        }, [])  // Empty dependency array ensures this runs once when the component mounts
    )
    const pendingRequests = friends.filter(friend => friend.theyRequestedMe === 'Requested');

    // Accept a follow request
    /*const acceptRequest = (id) => {
        setFriends((prevFriends) =>
            prevFriends.map((req) =>
                req.id === id ? { ...req, theyRequestedMe: 'Following' } : req
            )
        );
    };

    // Decline/delete a follow request
    const deleteRequest = (id) => {
        setFriends((prevFriends) =>
            prevFriends.map((req) =>
                req.id === id ? { ...req, theyRequestedMe: 'Not Following' } : req
            )
        );
    };

    // Follow back a user
    const followBack = (id) => {
        setFriends((prevFriends) =>
            prevFriends.map((req) =>
                req.id === id ? { ...req, iRequestedThem: 'Requested' } : req
            )
        );
    }; */

    // Navigate to profile view when a friend is pressed
    const handleProfilePress = (userId) => {
        navigation.navigate('ProfileView', { userId });
    };

    /*useEffect(() => {
        const getAllUserInfo = async () => {
            try {
                const userIds = [1, 2, 3, 4];  // IDs of users you want to fetch
                const userPromises = userIds.map(async (userId) => {
                    const userInfo = await backendMock.getUserInfo(userId);
                    return userInfo;
                });

                const allUserInfo = await Promise.all(userPromises);
                setUserInfo(allUserInfo);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getAllUserInfo();
    }, []);*/

    // Get the primary action button based on request state
    const getPrimaryAction = (item) => {
        if (item.theyRequestedMe === 'Requested') {
            return (
                <AppButton
                    variant="default"
                    size="sm"
                    onPress={() => acceptRequest(item.id)}
                >
                    Accept
                </AppButton>
            );
        } else if (item.theyRequestedMe === 'Following' && item.iRequestedThem === 'Not Following') {
            return (
                <AppButton
                    variant="outline"
                    size="sm"
                    onPress={() => followBack(item.id)}
                >
                    Follow Back
                </AppButton>
            );
        } else if (item.theyRequestedMe === 'Following' && item.iRequestedThem === 'Requested') {
            return (
                <AppButton
                    variant="secondary"
                    size="sm"
                    disabled={true}
                >
                    Requested
                </AppButton>
            );
        } else if (item.theyRequestedMe === 'Following' && item.iRequestedThem === 'Following') {
            return (
                <AppButton
                    variant="secondary"
                    size="sm"
                    disabled={true}
                >
                    Following
                </AppButton>
            );
        }

        return null;
    };

    // Render follow request item
    const renderRequestItem = ({ item }) => (
        <Card variant="default" style={styles.requestCard}>
            <View style={styles.requestContent}>
                <TouchableOpacity
                    style={styles.requestUserInfo}
                    onPress={() => handleProfilePress(item.id)}
                >
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <Text style={styles.userName}>{item.name}</Text>
                </TouchableOpacity>

                <View style={styles.requestActions}>
                    {getPrimaryAction(item)}

                    {item.theyRequestedMe === 'Requested' && (
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => deleteRequest(item.id)}
                        >
                            <Ionicons name="close" size={18} color={appColors.Dark_Grey} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Card>
    );

    // Render friend grid item
    const renderFriendItem = ({ item }) => {
        if (!item) return null;
        const userData = item[0];

        return (
            <TouchableOpacity
                style={styles.friendItem}
                onPress={() => handleProfilePress(userData.user_id)}
                activeOpacity={0.7}
            >
                <View style={styles.friendItemContent}>
                    <View style={styles.friendAvatarContainer}>
                        {userData.profile_picture ? (
                            <Image source={{ uri: userData.profile_picture }} style={styles.friendAvatar} />
                        ) : (
                            <View style={[styles.friendAvatar, styles.placeholderAvatar]}>
                                <Text style={styles.avatarInitial}>
                                    {userData.username.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.friendTextContainer}>
                        <Text style={styles.friendUsername} numberOfLines={1} ellipsizeMode="tail">
                            {userData.username}
                        </Text>
                        {userData.fullName && (
                            <Text style={styles.friendName} numberOfLines={1} ellipsizeMode="tail">
                                {userData.fullName}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={appColors.UW_Purple} />
                <Text style={styles.loadingText}>Loading your connections...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorText}>{error}</Text>
                <AppButton
                    variant="default"
                    onPress={() => navigation.navigate('PeopleView')}
                >
                    Retry
                </AppButton>
            </SafeAreaView>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Follow Requests Section */}
            <Card variant="default" style={styles.sectionCard}>
                <Card.Header style={styles.sectionHeader}>
                    <Card.Title>Follow Requests</Card.Title>
                    {pendingRequests.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{pendingRequests.length}</Text>
                        </View>
                    )}
                </Card.Header>

                <Card.Content style={styles.requestsContent}>
                    {pendingRequests.length > 0 ? (
                        <FlatList
                            data={pendingRequests}
                            renderItem={renderRequestItem}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.requestSeparator} />}
                            contentContainerStyle={styles.requestsList}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="person-add-outline" size={48} color={appColors.Grey_600} />
                            <Text style={styles.emptyStateText}>No pending requests</Text>
                            <Text style={styles.emptyStateSubtext}>
                                When people request to follow you, they'll appear here.
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            {/* Friends Section */}
            <Card variant="default" style={styles.sectionCard}>
                <Card.Header style={styles.sectionHeader}>
                    <Card.Title>Friends</Card.Title>
                    {userInfo.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{userInfo.length}</Text>
                        </View>
                    )}
                </Card.Header>

                <Card.Content style={styles.friendsContent}>
                    {userInfo.length > 0 ? (
                        <View style={styles.friendsGrid}>
                            {userInfo.map((item, index) => (
                                <View key={index} style={styles.friendItemWrapper}>
                                    {renderFriendItem({ item })}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color={appColors.Grey_600} />
                            <Text style={styles.emptyStateText}>No friends yet</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Follow others and get followed back to build connections.
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </Card>
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
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.m,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    loadingText: {
        marginTop: spacing.m,
        fontSize: 16,
        color: appColors.Grey_600,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: spacing.xl,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: appColors.Dark_Grey,
        marginTop: spacing.m,
    },
    errorText: {
        fontSize: 16,
        color: appColors.Grey_600,
        textAlign: 'center',
        marginTop: spacing.s,
    },
    sectionCard: {
        marginBottom: spacing.l,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countBadge: {
        backgroundColor: appColors.UW_Purple,
        borderRadius: 12,
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        minWidth: 24,
        alignItems: 'center',
    },
    countText: {
        color: appColors.White,
        fontSize: 12,
        fontWeight: 'bold',
    },
    requestsContent: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    requestsList: {
        paddingVertical: spacing.xs,
    },
    requestSeparator: {
        height: 1,
        backgroundColor: appColors.Grey_100,
        marginVertical: spacing.xs,
    },
    requestCard: {
        marginHorizontal: spacing.xs,
        marginVertical: spacing.xs,
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    requestContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    requestUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: spacing.m,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: appColors.Dark_Grey,
    },
    requestActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m, // Increased from spacing.s to spacing.m for more space between buttons
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendsContent: {
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.s,
    },
    friendsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.xs,
    },
    friendItemWrapper: {
        width: '50%', // Changed from 33% to 50% (2 columns instead of 3)
        padding: spacing.xs,
    },
    friendItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: spacing.s,
        borderWidth: 1,
        borderColor: '#eaeaea',
    },
    friendItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendAvatarContainer: {
        marginRight: spacing.m,
    },
    friendAvatar: {
        width: 50, // Reduced from 80
        height: 50, // Reduced from 80
        borderRadius: 25,
    },
    placeholderAvatar: {
        backgroundColor: appColors.UW_Purple,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 20, // Reduced from 32
        fontWeight: 'bold',
        color: appColors.White,
    },
    friendTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    friendUsername: {
        fontSize: 14,
        fontWeight: '600',
        color: appColors.Dark_Grey,
    },
    friendName: {
        fontSize: 12,
        color: appColors.Grey_600,
        marginTop: 2,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.m,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: appColors.Dark_Grey,
        marginTop: spacing.m,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: appColors.Grey_600,
        textAlign: 'center',
        marginTop: spacing.xs,
        lineHeight: 20,
    },
});

export default PeopleView;