import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserAvatar from './UserAvatar';
import appColors from '../common/app-colors';
import { Ionicons } from '@expo/vector-icons';

/**
 * UserRecommendationItem
 * 
 * A component that displays a user recommendation with their avatar, name, and similarity score.
 * Redesigned for a modern and beautiful look.
 * 
 * @param {Object} props
 * @param {string} props.name - The user's display name
 * @param {number} props.similarityScore - A number between 0 and 1 indicating similarity
 * @returns {JSX.Element} The rendered user recommendation item
 */
const UserRecommendationItem = ({ name, similarityScore = 0 }) => {
    // Convert similarity score to percentage
    const scorePercentage = Math.round(similarityScore * 100);

    return (
        <View style={styles.container}>
            <UserAvatar username={name} width={50} height={50} />
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.badgeContainer}>
                    <Ionicons name="stats-chart-outline" size={14} color="#fff" />
                    <Text style={styles.badgeText}>{scorePercentage}% match</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: appColors.White,
        padding: 16,
        borderRadius: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: appColors.Dark_Grey,
        marginBottom: 6,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#81C784', // changed from #4CAF50 to a lighter green
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start'
    },
    badgeText: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 4,
        fontWeight: '500',
    }
});

export default UserRecommendationItem;