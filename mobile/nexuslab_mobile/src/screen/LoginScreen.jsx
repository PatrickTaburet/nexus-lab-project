import { TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import globalStyles from '../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/MyButton';

const LoginScreen = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name={"arrow-back-circle"} color={colors.lightest} size={50} />
      </TouchableOpacity>

      {/* Form */}
      
      <View style={styles.formContainer}>
        <Text style={[styles.mainText, globalStyles.text3]}>LOGIN</Text>
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
        <View style={styles.checkboxContainer}>
          {/* <CheckBox
            checked={checked}
            iconColor={'#FFFFFF'}
            iconSize={18}
            textStyle={{fontSize: 15, fontWeight: 700}}
            textColor={"white"}
            onChange={setIsChecked}
            title={'Remember me'}
          /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={[styles.signup, globalStyles.text2]}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <MyButton
          HandlePress={() => {
            navigation.navigate('Login');
          }}
          myStyle={styles.submitButton}
        >
          Login
        </MyButton>
      </View>

    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.web_black,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },

    backButton: {
      position: 'absolute',
      top: 50,
      left : 20,
      backgroundColor: "",
      borderRadius: 25,
    },

    mainText:{
      color: "rgb(217, 0, 255)",
      marginBottom: 30,
    },
    formContainer : {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#222',
      width: '100%',
      paddingVertical: 40
    },
    inputContainer:{
      marginVertical: 15,
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
    },
    submitButton:{
      marginTop: 20
    }
})