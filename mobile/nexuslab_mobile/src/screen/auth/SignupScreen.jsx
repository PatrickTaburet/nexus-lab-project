import { ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { colors } from '../../utils/colors'
import globalStyles from '../../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../../components/MyButton';
import { Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { signup } from '../../services/api/authApi';
import * as FileSystem from 'expo-file-system';
import MyModale from '../../components/MyModale';
import ModalContent from '../../components/ModalContent';

const SignupScreen = () => {

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.size > 2 * 1024 * 1024) {
      alert('The image is too large. Please select an image smaller than 2 MB.');
      return;
    }

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
    if (!checked) {
      setError("You must agree to the terms");
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

       <MyModale
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        onSubmit={()=>{
          setChecked(true);
          setModalVisible(false);
        }}
        title={`Accept Terms and Conditions`}
        accessibilityLabel={`Terms and Conditions`}
      >
        <ModalContent/>
      </MyModale>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}
        accessible={true}
        accessibilityLabel="Go back to the welcome screen"
        accessibilityHint="Returns to the welcome screen for more options"
      >
        <Ionicons name={"arrow-back-circle"} color={colors.web_white} size={50} />
      </TouchableOpacity>
      <ScrollView  contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 50}}>

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
              accessible={true}
              accessibilityLabel="Username"
              accessibilityHint="Enter your username here"
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
              accessible={true}
              accessibilityLabel="Email address"
              accessibilityHint="Enter your email address here"
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
              accessible={true}
              accessibilityLabel="Password"
              accessibilityHint="Enter your password here"
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
              accessible={true}
              accessibilityLabel="Confirm password"
              accessibilityHint="Re-enter your password to confirm"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
              name={"person-circle-outline"}
              size={20}
              style={styles.inputIcon}
            />
            <TouchableOpacity 
              onPress={handleSelectImage} 
              style={styles.imagePicker}
              accessible={true}
              accessibilityLabel={profilePicture ? 'Change profile picture' : 'Select profile picture'}
              accessibilityHint="Choose an image to use as your profile picture"
            >
              <Text>{profilePicture ? 'Change Profile Picture' : 'Select Profile Picture'}</Text>
            </TouchableOpacity>
          </View>

          {profilePicture && (
            <Image 
              source={{ uri: profilePicture.uri }} 
              style={styles.image} 
              accessible={true}
              accessibilityLabel="Selected profile picture"
            />
          )}

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              uncheckedColor={"white"}
              color={"rgb(217, 0, 255)"}
              accessible={true}
              accessibilityLabel="Agree to terms and conditions"
            />
            <Text 
              style={styles.checkboxText} 
              onPress={() => setChecked(!checked)}
              accessible={true}
              accessibilityLabel="Terms agreement text"
              accessibilityHint="Click here to agree to the terms and conditions"
            >
              Agree
            </Text>
            <TouchableOpacity 
              onPress={() => {setModalVisible(true)}}
              accessible={true}
              accessibilityLabel="Modale for role request description"
              accessibilityHint="Touch to open modale"
              accessibilityRole='button'
            >
              <Text style={[styles.checkboxText, {"color": colors.cyan}]}> terms and conditions</Text>
            </TouchableOpacity>
              
              
          
          </View>
          <MyButton
            onPress={handleRegister}
            style={styles.submitButton}
            accessible={true}
            accessibilityLabel="Register button"
            accessibilityHint="Press here to create an account with the provided information"
          >
            Register
          </MyButton>

          {error ? (
            <Text style={globalStyles.warning} accessible={true} accessibilityLabel="Registration error">
              {error}
            </Text>
          ) : null}

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
    top: 15,
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
    marginTop: 55,
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
    width: 130,
    height: 50,
    marginTop: 30
  },
  checkboxContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText:{
    color: "white",
  },
})