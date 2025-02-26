import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, Animated, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * A modern, animated search bar component with clean design and smooth interactions
 * @param {Object} props
 * @param {Function} props.onSearch - Callback function when search is performed
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {Object} props.style - Additional styles to apply to the container
 */
const SearchBar = ({ onSearch, placeholder = 'Search...', style }) => {
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Animation value for the search bar width
    const animatedWidth = new Animated.Value(0);
    const clearButtonOpacity = new Animated.Value(0);

    // Refs for debounce functionality
    const lastSubmitted = useRef('');
    const debounceTimer = useRef(null);

    useEffect(() => {
        Animated.timing(clearButtonOpacity, {
            toValue: searchText.length > 0 ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [searchText]);

    // Auto search on inactivity with debounce (500ms)
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            if (searchText !== lastSubmitted.current) {
                lastSubmitted.current = searchText;
                onSearch && onSearch(searchText);
            }
        }, 500);
        return () => clearTimeout(debounceTimer.current);
    }, [searchText, onSearch]);

    useEffect(() => {
        const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
            inputRef.current?.blur();
        });

        return () => {
            keyboardDidHide.remove();
        };
    }, []);

    // Handle focus animation
    const handleFocus = () => {
        setIsFocused(true);
        Animated.spring(animatedWidth, {
            toValue: 1,
            useNativeDriver: false,
            friction: 12,
            tension: 30
        }).start();
    };

    // Handle blur animation
    const handleBlur = () => {
        if (!searchText) {
            setIsFocused(false);
            Animated.spring(animatedWidth, {
                toValue: 0,
                useNativeDriver: false,
                friction: 12,
                tension: 30
            }).start();
        }
    };

    // Handle search submission (if user manually submits, for example)
    const handleSearchSubmit = () => {
        if (searchText.trim()) {
            lastSubmitted.current = searchText;
            onSearch && onSearch(searchText);
        }
    };

    const handleClear = () => {
        setSearchText('');
        onSearch && onSearch('');
        inputRef.current?.focus();
    };

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.searchContainer,
                    {
                        backgroundColor: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                        transform: [{
                            scale: animatedWidth.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0.985, 0.995, 1],
                            })
                        }],
                    },
                ]}
            >
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#666"
                    style={styles.searchIcon}
                />
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                    enablesReturnKeyAutomatically
                />
                <Animated.View style={{ opacity: clearButtonOpacity }}>
                    {searchText !== '' && (
                        <Pressable
                            onPress={handleClear}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={18} color="#999" />
                        </Pressable>
                    )}
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = {
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: Platform.select({ ios: 8, android: 6 }),
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    clearButton: {
        padding: 4,
    },
};

export default SearchBar;