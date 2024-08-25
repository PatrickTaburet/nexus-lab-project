import { ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { colors } from '../utils/colors'
import globalStyles from '../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/MyButton';
import { CheckBox } from 'rn-inkpad';

const SignupScreen = () => {

  const navigation = useNavigation();
  const [checked, setIsChecked] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
      <Ionicons name={"arrow-back-circle"} color={colors.lightest} size={50} />
      </TouchableOpacity>
      <ScrollView  contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 100}}>


        {/* Form */}

        <View style={styles.formContainer}>
          <Text style={[styles.mainText, globalStyles.text3]}>SIGN UP</Text>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"person-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput placeholder='Username'/>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"mail-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput placeholder='Email'/>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"lock-closed-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput placeholder='Password'/>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"lock-closed-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput placeholder='Repeat Password'/>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"person-circle-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput placeholder='User picture'/>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={checked}
              iconColor={'#FFFFFF'}
              iconSize={18}
              textStyle={{fontSize: 15, fontWeight: 700}}
              textColor={"white"}
              onChange={setIsChecked}
              title={'Agree terms'}
            />
          </View>
          <MyButton
            HandlePress={() => {
              navigation.navigate('Login');
            }}
            myStyle={styles.submitButton}
          >
            Register
          </MyButton>
        </View>
      </ScrollView>
    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.web_black,
      padding: 20,
    },
    backButton: {
      position: 'absolute',
      top: 45,
      left : 20,
      backgroundColor: 'transparent',
      borderRadius: 25,
      zIndex: 3,
    },
    mainText:{
      color: "rgb(217, 0, 255)",
      marginBottom: 30,
    },
    text:{
      color: "white"
    },
    formContainer : {
      marginTop: 95,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#222',
      width: '100%',
      paddingVertical: 30
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
      marginTop: 40
    },
    checkboxContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginLeft: 30
    },
})