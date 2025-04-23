import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import moment from 'moment';
import appColors from '../common/app-colors';

const AddPosts = () => {

    const { posts, setPosts } = useProfileViewStore();

    const [modalVisible, setModalVisible] = useState(false);
    const [caption, setCaption] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleAddPost = () => {
        const newPost = {
            timestamp: moment().fromNow(),
            image: photo,
            caption: caption,
            likes: 0,
            comments: 0
        };
        setPosts([newPost, ...posts]);
        setModalVisible(false);
        setCaption('');
        setPhoto(null);
    };

    const handleSelectPhoto = async () => {
        let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setPhoto(pickerResult.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Post</Text>
            </TouchableOpacity>

            {/*
            <FlatList
                data={posts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View key={index} style={styles.postContainer}>
                        <PostCard
                            user={{
                                username: name,
                                profilePic: imageUri,
                            }}
                            timestamp={item.timestamp}
                            image={item.image}
                            caption={item.caption}
                            likes={item.likes}
                            comments={item.comments}
                        />
                    </View>
                )}
            />
            */}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Post</Text>
                        <TouchableOpacity
                            style={styles.photoButton}
                            onPress={handleSelectPhoto}
                        >
                            <Text style={styles.photoButtonText}>Select Photo</Text>
                        </TouchableOpacity>
                        {photo && <Image source={{ uri: photo }} style={styles.selectedPhoto} />}
                        {!photo && <Text>No photo selected</Text>}
                        <TextInput
                            style={styles.captionInput}
                            placeholder="Enter caption"
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleAddPost}
                            >
                                <Text style={styles.buttonText}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#f5f5f5',
        paddingTop: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    addButton: {
        padding: 10,
        width: 100,
        backgroundColor: appColors.UW_Purple,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // for Android shadow
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    postContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android shadow
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    postCaption: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    postTimestamp: {
        marginTop: 5,
        color: '#888',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    photoButton: {
        padding: 10,
        backgroundColor: appColors.UW_Purple,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    photoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    selectedPhoto: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    captionInput: {
        width: '100%',
        padding: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        textAlignVertical: 'top', // for multiline input
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cancelButton: {
        backgroundColor: appColors.Grey_600,
    },
    submitButton: {
        backgroundColor: appColors.UW_Purple,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddPosts;
