import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import UserRecommendationItem from '../components/UserRecommendationItem';
import appColors from '../common/app-colors';

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

  // Dummy data with similarity scores - replace with API data in production
  const dummyUsers = useMemo(() => [
    { id: '1', name: 'Alice Johnson', similarityScore: 0.95 },
    { id: '2', name: 'Bob Smith', similarityScore: 0.82 },
    { id: '3', name: 'Charlie Brown', similarityScore: 0.78 },
    { id: '4', name: 'Diana Prince', similarityScore: 0.91 },
    { id: '5', name: 'Edward Nash', similarityScore: 0.88 }
  ], []);

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
    const filtered = dummyUsers
      .filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => b.similarityScore - a.similarityScore);
    setResults(filtered);
  }, [dummyUsers]);

  // Initialize with all recommendations sorted by similarity
  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBarContainer}>
          <SearchBar 
            onSearch={handleSearch} 
            style={styles.searchBar}
            placeholder="Search recommendations..."
          />
        </View>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <UserRecommendationItem
              name={item.name}
              similarityScore={item.similarityScore}
            />
          </View>
        )}
        ListEmptyComponent={
          query.trim() !== '' ? (
            <Text style={styles.noResultsText}>No recommendations found.</Text>
          ) : null
        }
        contentContainerStyle={styles.resultsContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.Grey_100,
  },
  searchWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: appColors.White,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBarContainer: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16,
  },
  searchBar: {
    width: '100%',
  },
  itemContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    width: '100%',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: appColors.Grey_600,
  }
});

export default RecommendationView;
