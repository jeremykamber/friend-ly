import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostItem = ({ user, timestamp, image, caption, likes, comments, post_id }) => {
    const [shareError, setShareError] = useState(null);

    // Share functionality
    const handleShare = async () => {
        setShareError(null);
        try {
            await Share.share({
                message: `${user?.fullName ? user.fullName + ' ' : ''}(@${user?.username || ''}): ${caption || ''}`,
                url: image || undefined,
                title: 'Check out this post!'
            });
        } catch (error) {
            setShareError("Failed to share. Please try again.");
            console.error("Error sharing post:", error);
        }
    };

    return (
        <View style={styles.card}>
            {/* Header: Profile (pfp, full name, username, timestamp) */}
            <View style={styles.headerRow}>
                {user?.profilePic ? (
                    <Image source={{ uri: user.profilePic }} style={styles.profilePicLarge} />
                ) : (
                    <View style={[styles.profilePicLarge, styles.loadingProfilePic]}>
                        <ActivityIndicator size="small" color="#ccc" />
                    </View>
                )}
                <View style={styles.userMeta}>
                    <Text style={styles.fullName}>{user?.fullName || user?.username || "Loading..."}</Text>
                    <View style={styles.userRow}>
                        <Text style={styles.username}>@{user?.username || "username"}</Text>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.timestamp}>{timestamp || "Just now"}</Text>
                    </View>
                </View>
            </View>

            {/* Caption */}
            {caption ? (
                <Text style={styles.caption}>{caption}</Text>
            ) : null}

            {/* Post Image */}
            {image ? (
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.postImageRounded} />
                </View>
            ) : null}

            {/* Actions: Like, Comment, Share */}
            <View style={styles.actionsBar}>
                <TouchableOpacity style={styles.actionIconButton}>
                    <Ionicons name="heart-outline" size={22} color="#333" />
                    <Text style={styles.actionCount}>{likes ?? ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIconButton}>
                    <Ionicons name="chatbubble-outline" size={22} color="#333" />
                    <Text style={styles.actionCount}>{comments ?? ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIconButton} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={22} color={shareError ? "#d00" : "#333"} />
                </TouchableOpacity>
            </View>
            {shareError ? (
                <Text style={styles.shareError}>{shareError}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        marginHorizontal: 15,
        paddingVertical: 10,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingBottom: 8,
    },
    profilePicLarge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    loadingProfilePic: {
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },
    userMeta: {
        flex: 1,
        justifyContent: "center",
    },
    fullName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    username: {
        fontSize: 13,
        color: "#666",
    },
    dot: {
        fontSize: 13,
        color: "#aaa",
        marginHorizontal: 4,
    },
    timestamp: {
        fontSize: 13,
        color: "#aaa",
    },
    caption: {
        fontSize: 15,
        color: "#222",
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    imageWrapper: {
        width: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#f3f3f3',
        marginTop: 4,
        marginBottom: 10,
    },
    postImageRounded: {
        width: '100%',
        height: 200,
        borderRadius: 14,
        resizeMode: 'cover',
    },
    actionsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 4,
        paddingTop: 6,
        paddingBottom: 2,
        gap: 8,
    },
    actionIconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
        marginRight: 10,
    },
    actionCount: {
        marginLeft: 4,
        fontSize: 15,
        color: '#222',
        fontWeight: '500',
    },
    shareError: {
        color: "#d00",
        fontSize: 13,
        marginLeft: 18,
        marginTop: 2,
    },
});

export default PostItem;
