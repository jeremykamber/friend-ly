import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const UserAvatar2 = ({ username, picture}) => {
    return (
        <View style={styles.container}>
            {picture && <Image source={{ uri: picture }} style={styles.picture} />}
            <Text>{username}</Text>
        </View>
    );
};

export default UserAvatar2;

const styles = StyleSheet.create({
    picture: {
        width: 55,
        height: 55,
        marginHorizontal: 30,
        borderRadius: 60,
    },
    container: {
        alignItems: 'center',
    },
});

