import { ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { colors } from '../../utils/colors'
import globalStyles from '../../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../../components/MyButton';
import { Checkbox } from 'react-native-paper';
import useApi from '../../hooks/useApi';
import * as ImagePicker from 'expo-image-picker';

const SignupScreen = () => {

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const { signup } = useApi();

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
    const uri = result.assets[0].uri;
    const name = uri.split('/').pop();
    const type = 'image/' + name.split('.').pop();

    setProfilePicture({
      uri: uri,
      type: type,
      name: name,
    });
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (profilePicture) {
      formData.append('profilePicture', {
        uri: profilePicture.uri,
        type: profilePicture.type,
        name: profilePicture.name,
      });
    }
    try {
      const response = await signup(formData);
      if (response) {
        alert('Registration successful!');
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'An error occurred during registration.';
        setError(errorMessage);
      } else {
        setError('An error occurred during registration.');
      }
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
            <TextInput 
              placeholder='Username'
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"mail-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"lock-closed-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Password'
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />          
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"lock-closed-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Confirm Password'
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"person-circle-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
              <Text>{profilePicture ? 'Change Profile Picture' : 'Select Profile Picture'}</Text>
            </TouchableOpacity>
          </View>
          {profilePicture && (
            <Image source={{ uri: profilePicture.uri }} style={styles.image} />
          )}
          
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              uncheckedColor={"white"}
              color={"rgb(217, 0, 255)"}
            />
            <Text style={styles.checkboxText} onPress={() => setChecked(!checked)}>Agree terms</Text>
          </View>
          <MyButton
            HandlePress={handleRegister}
            myStyle={styles.submitButton}
          >
            Register
          </MyButton>
          {error ? <Text style={globalStyles.warning} >{error}</Text> : null}
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
      fontSize: 44
    },
    text:{
      color: "white"
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: 10,
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
      marginTop: 40,
      fontSize: 20
    },
    checkboxContainer:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxText:{
      color: "white",
    },
})