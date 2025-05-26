import React, { useState } from 'react';
import { TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddPosts from './AddPosts';
import appColors from '../common/app-colors';

const AddPostsFab = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.85}
                accessibilityLabel="Add a post"
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <AddPosts
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: appColors.UW_Purple,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
        zIndex: 10,
    },
});

export default AddPostsFab;