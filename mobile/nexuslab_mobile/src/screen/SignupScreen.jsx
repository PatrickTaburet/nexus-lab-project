import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import globalStyles from '../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {

  const navigation = useNavigation();
  const HandleBack = () => {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={HandleBack}
      >
        <Ionicons name={"arrow-back-circle"} color={colors.lightest} size={50} />
      </TouchableOpacity>
        <Text style={[styles.headerText, globalStyles.text3]}>SIGNUP</Text>
      

    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.secondary_dark,
    },
    content : {

    },
    backButton: {
      position: 'absolute',
      top: 50,
      left : 20,
      backgroundColor: "",
      borderRadius: 25,
    },

    text:{
      color: "white"
    }
})