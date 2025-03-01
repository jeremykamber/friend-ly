import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import appColors from '../common/app-colors';
import InterestSubmitButton from '../components/InterestSubmitButton';
import useProfileViewStore from '../common/zustand_stores/ProfileViewStore';
import { useNavigation } from '@react-navigation/native';

const ClassInput = () => {
    const {currentClasses, setCurrentClasses, hasPreviousScreen} = useProfileViewStore();
    const navigation = useNavigation();

    const [classes, setClasses] = useState(currentClasses);
    const [isModalVisible, setModalVisible] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [className, setClassName] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const handleSubmit = () => {
        setCurrentClasses(classes);
        if (hasPreviousScreen) {
            navigation.navigate('ProfileViewEditMode');
        }
        else {
            navigation.navigate('InterestSelectionView');
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openEditModal = (index) => {
        const selectedClass = classes[index];
        setClassCode(selectedClass.code);
        setClassName(selectedClass.name);
        setEditingIndex(index);
        toggleModal();
    }

    const addOrUpdateClass = () => {
        if (classCode && className) {
            if (editingIndex !== null) {
                const updatedClasses = classes.map((item, index) =>
                    index === editingIndex ? { code: classCode, name: className } : item
                );
                setClasses(updatedClasses);
            } else {
                setClasses([...classes, { code: classCode, name: className }]);
            }
            setClassCode('');
            setClassName('');
            setEditingIndex(null);
            toggleModal();
        } else {
            alert('Please fill in both the class code and class name.');
        }
    };

    const removeClass = (index) => {
        const updatedClasses = classes.filter((_, i) => i !== index);
        setClasses(updatedClasses);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Text style={styles.buttonText}>Add Class</Text>
            </TouchableOpacity>

            <FlatList
                data={classes}
                renderItem={({ item, index }) => (
                    <View style={styles.classItem}>
                        <Text>{item.code} - {item.name}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(index)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeButton} onPress={() => removeClass(index)}>
                                <Text style={styles.buttonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{editingIndex !== null ? 'Edit Class' : 'Add Class'}</Text>
                    <Text style={styles.label}>Class Code:</Text>
                    <TextInput
                        style={styles.input}
                        value={classCode}
                        onChangeText={setClassCode}
                        placeholder="Enter class code"
                    />
                    <Text style={styles.label}>Class Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={className}
                        onChangeText={setClassName}
                        placeholder="Enter class name"
                    />
                    <TouchableOpacity style={styles.button} onPress={addOrUpdateClass}>
                        <Text style={styles.buttonText}>{editingIndex !== null ? 'Update' : 'Add'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <View styles={styles.buttonContainer}>
                <InterestSubmitButton text='Done!' onPress={handleSubmit}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    classItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: appColors.UW_Purple,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: appColors.UW_Purple,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#003c62',
        padding: 5,
        paddingHorizontal: 17,
        borderRadius: 5,
        marginRight: 5,
    },
    removeButton: {
        backgroundColor: '#c23b22',
        padding: 5,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
});

export default ClassInput;