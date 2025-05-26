import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import UserRecommendationItem from '../components/UserRecommendationItem';
import appColors from '../common/app-colors';
import * as SecureStore from 'expo-secure-store'
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import AppButton from '../components/AppButton';

/**
 * RecommendationView
 * 
 * A screen that displays user recommendations sorted by similarity score,
 * with the ability to search through recommendations.
 * 
 * @returns {JSX.Element} The RecommendationView screen component
 */
const RecommendationView = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [token, setToken] = useState(null);
  const [similarUsers, setSimilarUsers] = useState([])
  const [currentUsers, setCurrentUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getInfo = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await SecureStore.getItemAsync("JWT") // jwt token
          if (!result) {
            console.log("No token found.")
            setError("Authentication required. Please login again.");
            setLoading(false);
            return
          }
          setToken(result)
          const response = await fetch("http://localhost:8000/similar-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: result })
          })
          const data = await response.json();
          console.log(data)
          setSimilarUsers(data);
          setCurrentUsers(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching recommendations:", err);
          setError("Failed to load recommendations. Please try again later.");
          setLoading(false);
        }
      }
      getInfo()
    }, [])
  )

  useEffect(() => {
    navigation.setOptions({
      title: "Recommendations",
      headerShown: true,
      headerStyle: {
        backgroundColor: appColors.White,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTitleStyle: {
        fontSize: 17,
        fontWeight: '600',
        color: appColors.Dark_Grey,
      },
    });
  }, [navigation]);

  /**
   * handleSearch
   * 
   * Filters and sorts recommendations based on search query and similarity scores.
   * In production, this should be integrated with backend search/recommendation engine.
   * 
   * @param {string} searchText - The search query entered by the user
   */
  const handleSearch = useCallback((searchText) => {
    setQuery(searchText);

    const filtered = similarUsers
      .filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => b.score - a.score);
    setCurrentUsers(filtered);
  }, [similarUsers]);

  // Initialize with all recommendations sorted by similarity
  useEffect(() => {
    if (similarUsers.length > 0) {
      handleSearch('');
    }
  }, [handleSearch, similarUsers]);

  // Group users by similarity score range
  const groupedUsers = useMemo(() => {
    if (!currentUsers || currentUsers.length === 0) return {};

    return currentUsers.reduce((acc, user) => {
      let category;
      if (user.score >= 0.8) {
        category = 'High Compatibility';
      } else if (user.score >= 0.5) {
        category = 'Medium Compatibility';
      } else {
        category = 'Lower Compatibility';
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(user);
      return acc;
    }, {});
  }, [currentUsers]);

  // Flatten grouped users for FlatList with section headers
  const flattenedData = useMemo(() => {
    if (!groupedUsers) return [];

    return Object.entries(groupedUsers).flatMap(([category, users]) => [
      { type: 'header', title: category },
      ...users.map(user => ({ type: 'user', data: user }))
    ]);
  }, [groupedUsers]);

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{item.title}</Text>
        </View>
      );
    } else {
      const { username, score } = item.data;
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileView', { username })}
          activeOpacity={0.7}
        >
          <Card variant="default" style={styles.userCard}>
            <View style={styles.userCardContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{username[0]?.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{username}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Similarity:</Text>
                  <View style={styles.scoreBar}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        {
                          width: `${Math.round(score * 100)}%`,
                          backgroundColor: score >= 0.8
                            ? '#4ade80'
                            : score >= 0.5
                              ? '#facc15'
                              : '#fb7185'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.scorePercentage}>{Math.round(score * 100)}%</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={appColors.Grey_600} />
            </View>
          </Card>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left', 'bottom']}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            onSearch={handleSearch}
            style={styles.searchBar}
            placeholder="Search recommendations..."
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.UW_Purple} />
          <Text style={styles.loadingText}>Finding your matches...</Text>
        </View>
      ) : error ? (
        <Card variant="glass" style={styles.errorCard}>
          <Card.Content style={styles.errorContent}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <AppButton
              style={{
                marginTop: 16,
              }}
              onPress={() => {
                setLoading(true);
                navigation.navigate('RecommendationView');
              }}
            >
              Retry
            </AppButton>

          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={flattenedData}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'user' ? `user-${item.data.username}` : `header-${index}`
          }
          ListEmptyComponent={
            <Card variant="glass" style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                {query.trim() !== '' ? (
                  <>
                    <Ionicons name="search" size={48} color={appColors.Grey_600} />
                    <Text style={styles.emptyTitleText}>No matches found</Text>
                    <Text style={styles.emptyText}>
                      We couldn't find any users matching "{query}"
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="people" size={48} color={appColors.Grey_600} />
                    <Text style={styles.emptyTitleText}>No recommendations yet</Text>
                    <Text style={styles.emptyText}>
                      Complete your profile to get better recommendations!
                    </Text>
                  </>
                )}
              </Card.Content>
            </Card>
          }
          contentContainerStyle={[
            styles.resultsContainer,
            !flattenedData.length && styles.emptyContainer
          ]}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: appColors.White,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBarContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  searchBar: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: appColors.Grey_600,
    fontWeight: '500',
  },
  errorCard: {
    margin: 16,
  },
  errorContent: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: appColors.Dark_Grey,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: appColors.UW_Purple,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: appColors.White,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.UW_Purple,
  },
  userCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.UW_Purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: appColors.White,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.Dark_Grey,
    marginBottom: 4,
  },
  scoreContainer: {
    flexDirection: 'column',
  },
  scoreLabel: {
    fontSize: 12,
    color: appColors.Grey_600,
    marginBottom: 2,
  },
  scoreBar: {
    height: 6,
    width: '80%',
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scorePercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: appColors.Grey_600,
  },
  resultsContainer: {
    paddingTop: 8,
    paddingBottom: 24,
    minHeight: '100%',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginTop: 20,
    alignSelf: 'stretch',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.Dark_Grey,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: appColors.Grey_600,
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 16,
  }
});

export default RecommendationView;
