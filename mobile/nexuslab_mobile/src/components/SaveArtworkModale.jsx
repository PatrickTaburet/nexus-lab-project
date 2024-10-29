// SaveArtworkModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Image } from 'react-native';
import MyButton from './MyButton';
import config from '../config/config';
import { colors } from '../utils/colors';
import globalStyles from '../utils/styles';

const SaveArtworkModal = ({ visible, onClose, onSubmit, imagePreview, imageFolder }) => { 
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const previewUrl = `${config.apiUrl}/images/${imageFolder}/${imagePreview}`;

  return (
    <Modal visible={visible} transparent animationType="slide" accessible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalHeader, globalStyles.mainTitle]} accessible={true} accessibilityLabel="Save Artwork Header">
            Save my Artwork
          </Text>
          {imagePreview && (
            <Image 
              source={{ uri: previewUrl }} 
              style={styles.preview}
              accessible={true}
              accessibilityLabel="Artwork preview image"
              resizeMode="contain" 
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            accessible={true}
            accessibilityLabel="Artwork Title"
            accessibilityHint="Enter the title for your artwork"
          />
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            accessible={true}
            accessibilityLabel="Artwork Comment"
            accessibilityHint="Enter your comment for the artwork"
            multiline
          />
          <View style={styles.buttonContainer}>
            <MyButton
              onPress={() => {
                onSubmit(title, comment);
                setTitle("");
                setComment("");
              }}
              accessible={true}
              accessibilityLabel="Submit Artwork"
              accessibilityHint="Tap to submit your artwork details"
            >
              Submit
            </MyButton>
            <MyButton
              onPress={onClose}
              isSecondary={true}
              accessible={true}
              accessibilityLabel="Close Modal"
              accessibilityHint="Tap to go back without saving"
            >
              Back
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SaveArtworkModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.purple_dark,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: colors.cyan,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.web_white,
  },
  modalHeader: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 19,
    height: 40,
    marginTop: 10,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 5,
  },
  preview: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.cyan,
    height: 240,
    marginBottom: 25,
  },
});

