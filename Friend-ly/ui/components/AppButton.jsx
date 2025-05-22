import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import appColors from '../common/app-colors';

/**
 * AppButton - A versatile button component with multiple variants
 * 
 * @param {object} props
 * @param {string} [props.variant='default'] - Button variant ('default', 'destructive', 'outline', 'secondary', 'ghost', 'link')
 * @param {string} [props.size='md'] - Button size ('sm', 'md', 'lg')
 * @param {boolean} [props.isLoading=false] - Show loading spinner
 * @param {boolean} [props.disabled=false] - Disable button
 * @param {function} props.onPress - Button press handler
 * @param {ReactNode} props.children - Button content
 * @param {object} [props.style] - Additional style for the button
 * @param {object} [props.textStyle] - Additional style for the text
 */
const AppButton = ({
    variant = 'default',
    size = 'md',
    isLoading = false,
    disabled = false,
    onPress,
    children,
    style,
    textStyle,
    ...props
}) => {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        disabled && styles[`${variant}Disabled`],
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="small"
                        color={variant === 'default' ? '#fff' : '#000'}
                    />
                    {children && <Text style={[textStyles, styles.loadingText]}>{children}</Text>}
                </View>
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Sizes
    sm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    md: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    lg: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },

    // Text sizes
    smText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 16,
    },
    lgText: {
        fontSize: 18,
    },

    // Variants
    default: {
        backgroundColor: appColors.UW_Purple,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        shadowColor: '#4b2e83',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: appColors.UW_Purple,
    },
    secondary: {
        backgroundColor: '#F8F8F8',
        borderWidth: 0,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    link: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
    },

    // Text variants
    text: {
        fontWeight: '500',
    },
    defaultText: {
        color: '#FFFFFF',
    },
    destructiveText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: '#000000',
    },
    secondaryText: {
        color: appColors.UW_Purple,
    },
    ghostText: {
        color: appColors.UW_Purple,
    },
    linkText: {
        color: '#000000',
        textDecorationLine: 'underline',
    },

    // Disabled states
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.5,
    },

    // Loading state
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 8,
    },
});

export default AppButton;