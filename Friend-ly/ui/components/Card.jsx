import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Variants: default, outline, shadow, subtle, glass
const VARIANT_STYLES = {
    default: {
        container: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
        },
    },
    outline: {
        container: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            borderWidth: 2,
            borderColor: '#6366f1',
            elevation: 0,
        },
    },
    shadow: {
        container: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            borderWidth: 0,
            elevation: 6,
            shadowColor: '#6366f1',
            shadowOpacity: 0.15,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
        },
    },
    subtle: {
        container: {
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            padding: 16,
            borderWidth: 0,
            elevation: 0,
        },
    },
    glass: {
        container: {
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 8 },
            backdropFilter: 'blur(8px)', // Only works on web
        },
    },
};

export function Card({
    children,
    variant = 'default',
    style,
    ...props
}) {
    const variantStyle = VARIANT_STYLES[variant]?.container || VARIANT_STYLES.default.container;
    return (
        <View style={[variantStyle, style]} {...props}>
            {children}
        </View>
    );
}

// Optional: Card.Header, Card.Title, Card.Content, Card.Footer
Card.Header = function CardHeader({ children, style }) {
    return (
        <View style={[styles.header, style]}>
            {children}
        </View>
    );
};

Card.Title = function CardTitle({ children, style }) {
    return (
        <Text style={[styles.title, style]}>
            {children}
        </Text>
    );
};

Card.Content = function CardContent({ children, style }) {
    return (
        <View style={[styles.content, style]}>
            {children}
        </View>
    );
};

Card.Footer = function CardFooter({ children, style }) {
    return (
        <View style={[styles.footer, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        marginVertical: 4,
    },
    footer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 8,
    },
});

export default Card;