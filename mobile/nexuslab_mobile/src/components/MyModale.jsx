import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MyButton from './MyButton';
import styles from '../utils/styles';
import { colors } from '../utils/colors';

const MyModale = ({ visible, onClose, onSubmit, title, content, children }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={myStyles.overlay}></View>
      <View style={myStyles.modalContainer}>
        <View style={myStyles.modalContent} accessible={true}>

          {title ? (
            <Text 
              style={[myStyles.modalHeader, styles.mainTitle]} 
              accessibilityRole="header"
            >
              {title}
            </Text>
          ) : null}

          {content ? (
            <Text 
            style={myStyles.modaltxt}
            numberOfLines={0}
            accessible={true}
            >
              {content}
            </Text>
          ) : null}

          <ScrollView>
            {children}
          </ScrollView>

          <View style={myStyles.modalBtnContainer}>

            {onSubmit ? (
            <MyButton
              onPress={onSubmit}
              accessible={true}
              accessibilityLabel="Confirm action"
              accessibilityHint="Confirms the action and proceeds"
              accessibilityRole="button" 
            >
              Confirm 
            </MyButton>
            ) : null}

            <MyButton
              onPress={onClose}
              isSecondary={true}
              accessible={true}
              accessibilityLabel="Go back"
              accessibilityHint="Closes the modal without making changes"
              accessibilityRole="button" 
            >
              Back
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MyModale;

const myStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '80%',
    marginVertical: 'auto'
  },
  overlay:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    flex:1,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: colors.purple_dark,
    padding: 25,
    borderRadius: 10,
    width: '90%',
    borderWidth: 2,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader:{
    textAlign: "center",
    fontSize: 23,
    height: 40,
    marginTop: 10,
  },
  modalBtnContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 25
  },
  modaltxt:{
    textAlign: "center",
    fontSize: 16,
    color: colors.web_white,
  },
})