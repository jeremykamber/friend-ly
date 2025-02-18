import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostCard = ({ user, timestamp, image, caption, likes, comments }) => {
    let likePost = () => {
        // TODO: Implement likePost functionality
    };

    let commentPost = () => {
        // TODO: Implement commentPost functionality
    };

    return (
        <View style={styles.card}>
            {/* Header: User Info */}
            <View style={styles.header}>
                {user?.profilePic ? (
                    <Image
                        source={{ uri: user.profilePic }}
                        style={styles.profilePic}
                    />
                ) : (
                    <View style={[styles.profilePic, styles.loadingProfilePic]}>
                        <ActivityIndicator size="small" color="#ccc" />
                    </View>
                )}
                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        {user?.username || "Loading..."}
                    </Text>
                    <Text style={styles.timestamp}>
                        {timestamp || "Just now"}
                    </Text>
                </View>
            </View>

            {/* Post Image */}
            {image ? (
                <Image source={{ uri: image }} style={styles.postImage} />
            ) : (
                <View style={[styles.postImage, styles.loadingImage]}>
                    <ActivityIndicator size="large" color="#ccc" />
                </View>
            )}

            {/* Caption */}
            <Text style={styles.caption}>
                <Text style={styles.username}>
                    {user?.username || "Loading"}{" "}
                </Text>
                {caption || "Loading..."}
            </Text>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={24} color="#333" />
                    <Text style={styles.actionText}>{likes ?? "..."}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color="#333"
                    />
                    <Text style={styles.actionText}>{comments ?? "..."}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    loadingProfilePic: {
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    timestamp: {
        fontSize: 12,
        color: "#777",
    },
    postImage: {
        width: "100%",
        height: 200,
    },
    loadingImage: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
    },
    caption: {
        padding: 15,
        fontSize: 14,
        color: "#333",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionText: {
        marginLeft: 5,
        fontSize: 14,
        color: "#333",
    },
});

export default PostCard;

// A good example of how to use this component:
// <PostCard
// user={{
// username: "Jane Doe",
// profilePic:
// "https://randomuser.me/api/portraits/women/1.jpg",
// }}
// timestamp="2 hours ago"
// image="https://placehold.co/600x300/png"
// caption="This is an example post with all props provided."
// likes={34}
// comments={12}
// />
