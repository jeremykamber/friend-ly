import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native';

const UserAvatar2 = ({ username, picture}) => {
    const navigation = useNavigation();

    const openProfile = () => {
        navigation.navigate('ProfileView'); // NAVIGATE TO PROFILE BASED ON USERNAME
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openProfile} style={styles.button}>
                {picture && <Image source={{ uri: picture }} style={styles.picture} />}
            </TouchableOpacity>
            <Text style={styles.text}>{username}</Text>
        </View>
    );
};

export default UserAvatar2;

const styles = StyleSheet.create({
    picture: {
        width: 75,
        height: 75,
        marginHorizontal: 30,
        borderRadius: 60,
    },
    container: {
        alignItems: 'center',
    },
    text: {
        marginTop: 5,
        fontSize: 13,
    },
    button: {
        borderRaidus: 60,
        overflow: 'hidden',
    },
});

