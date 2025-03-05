import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import appColors from '../common/app-colors';

const EditClassesButton = ({onPress}) => {
    return (
        <View style={styles.button}>
            <TouchableOpacity style={styles.circle} onPress={onPress}>
                <Ionicons name="pencil-outline" size={10} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        position: 'absolute',
        left: 155,
        top: 5,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 40 / 2,
        borderColor: appColors.Black,
        borderWidth: 1,
        backgroundColor: '#d3d3d3',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditClassesButton;