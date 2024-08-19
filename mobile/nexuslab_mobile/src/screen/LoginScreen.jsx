import { TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import globalStyles from '../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

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
      {/* Form */}
      <View style={styles.formContainer}>
      <Text style={[styles.headerText, globalStyles.text3]}>LOGIN</Text>
        <View style={styles.inputContainer}>
          <Ionicons 
          name={"mail-outline"}
          size={20}
          style={styles.inputIcon}
          />
          <TextInput placeholder='Enter your Email'/>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons 
          name={"lock-closed-outline"}
          size={20}
          style={styles.inputIcon}
          />
          <TextInput placeholder='Enter your Password'/>
        </View>
      </View>

    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.secondary_dark,
      padding: 20
      // justifyContent: 'center',
      // alignItems: 'center',
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
    },
    formContainer : {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
      height : '80%'
    },
    inputContainer:{
      marginVertical: 10,
      alignItems: "center",
      flexDirection: 'row',
      width: '80%',
      height:40,
      backgroundColor: "white",
      borderRadius:10,
      borderWidth: 1
    },
    inputIcon:{
      margin:7
    }
})