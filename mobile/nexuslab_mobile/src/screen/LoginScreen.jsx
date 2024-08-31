import { TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react';
import { colors } from '../utils/colors'
import globalStyles from '../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/MyButton';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const LoginScreen = ({ navigation, setIsLoggedIn  }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);

  const handleLogin = async () => {
    try {
        const response = await api.post('/login_check', { email, password });
        //  console.log('API Response:', response.data);
        const { token } = response.data;

        await AsyncStorage.setItem('token', token);
        setIsLoggedIn(true);
        navigation.navigate('Home');
    } catch (err) {
      console.log('Error:', err.response?.data);
        setError('Invalid email or password');
    }
};
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}
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
          <TextInput 
            placeholder='Enter your Email'
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons 
          name={"lock-closed-outline"}
          size={20}
          style={styles.inputIcon}
          />
          <TextInput 
            placeholder='Enter your Password'
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              uncheckedColor={"white"}
              color={"rgb(217, 0, 255)"}
            />
            <Text style={styles.checkboxText}>Remember me</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={[styles.signup, globalStyles.text2]}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <MyButton
          HandlePress={handleLogin}
          myStyle={styles.submitButton}
        >
          Login
        </MyButton>
        {error ? <Text style={globalStyles.warning} >{error}</Text> : null}
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
      marginTop: 20,
      fontSize: 20
    },
    bottom:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
    },
    checkboxContainer:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxText:{
      color: "white",
    },
    signup:{
      fontSize: 20,
      marginRight: 20,
      color: "rgb(217, 0, 255)"
    }
})