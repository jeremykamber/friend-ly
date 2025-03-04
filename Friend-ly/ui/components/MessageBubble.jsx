import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import appColors from '../common/app-colors';

const MessageBubble = ({
    message,
    isCurrentUser,
    timestamp,
    username,
    status = 'delivered' // 'sending', 'sent', 'delivered', 'read', 'failed'
}) => {
    return (
        <View style={[
            styles.container,
            isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
            status === 'failed' && styles.failedMessage
        ]}>
            {!isCurrentUser && username && (
                <Text style={styles.username}>
                    {username}
                </Text>
            )}
            <View style={[
                styles.bubble,
                isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                status === 'failed' && styles.failedBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    isCurrentUser ? styles.currentUserText : styles.otherUserText
                ]}>
                    {message}
                </Text>
            </View>
            <View style={[
                styles.timestampContainer,
                isCurrentUser ? styles.rightAlign : styles.leftAlign
            ]}>
                <Text style={styles.timestamp}>
                    {timestamp}
                </Text>
                {isCurrentUser && (
                    <>
                        {status === 'sending' ? (
                            <ActivityIndicator size="small" color={appColors.Grey_600} style={styles.statusIcon} />
                        ) : (
                            <Text style={[
                                styles.status,
                                status === 'failed' && styles.failedStatus
                            ]}>
                                {status === 'failed' ? 'Failed' :
                                    status === 'read' ? 'Read' :
                                        status === 'delivered' ? 'Delivered' :
                                            'Sent'}
                            </Text>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        alignSelf: 'flex-start',
        maxWidth: '80%',
    },
    currentUserContainer: {
        alignSelf: 'flex-end',
    },
    otherUserContainer: {
        alignSelf: 'flex-start',
    },
    username: {
        fontSize: 12,
        color: appColors.Grey_600,
        marginBottom: 2,
        marginLeft: 12,
    },
    bubble: {
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: appColors.Black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        alignSelf: 'flex-start', // This makes the bubble wrap to content width
    },
    currentUserBubble: {
        backgroundColor: appColors.UW_Purple,
        alignSelf: 'flex-end', // Align to the right for current user
    },
    otherUserBubble: {
        backgroundColor: appColors.Grey_100,
        alignSelf: 'flex-start', // Align to the left for other users
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    currentUserText: {
        color: appColors.White,
    },
    otherUserText: {
        color: appColors.Dark_Grey,
    },
    timestampContainer: {
        flexDirection: 'row',
        marginTop: 2,
        paddingHorizontal: 4,
        width: '100%', // Ensure the timestamp container spans full width of parent
    },
    rightAlign: {
        justifyContent: 'flex-end',
    },
    leftAlign: {
        justifyContent: 'flex-start',
    },
    timestamp: {
        fontSize: 11,
        color: appColors.Grey_600,
        marginRight: 4,
    },
    status: {
        fontSize: 11,
        color: appColors.Grey_600,
    },
    failedMessage: {
        opacity: 0.8,
    },
    failedBubble: {
        backgroundColor: appColors.Grey_300,
    },
    failedStatus: {
        color: appColors.Failed_Red,
    },
    statusIcon: {
        marginLeft: 4,
        width: 12,
        height: 12,
    }
});

export default MessageBubble;