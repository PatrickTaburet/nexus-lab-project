import { ScrollView, TextInput, ImageBackground, View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Image, Animated, Easing } from 'react-native';
import React, { useState, useEffect } from 'react'
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import {jwtDecode} from 'jwt-decode';
import config from '../config/config'; 
import { colors } from '../utils/colors'
import MyButton from '../components/MyButton';
import globalStyles from '../utils/styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useApi from '../services/api/hooks/useApi';
import { useAuth } from '../navigation/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { checkTokenValidity } from '../services/AuthService';
import * as FileSystem from 'expo-file-system';


const EditProfileScreen = ({ navigation })  => {

  const {api} = useApi();
  const {setIsLoggedIn, handleLogout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [rotation] = useState(new Animated.Value(0));
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

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

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await api.get(`/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUserData(response.data);
      //console.log(response.data);
      setUsername(response.data.pseudo);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const HandleUpdateProfile = async () => {
   
    const token = await AsyncStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const tokenUsername = decodedToken.username;

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
      const  response = await api.post(`/editUser/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if (response && email !== tokenUsername){
        await checkTokenValidity(handleLogout, setIsLoggedIn, email);
      }
      console.log('Profile updated successfully:')
      if (response) {
        alert('Update successful!');
        navigation.goBack();
      }
    } catch (error) {
      console.log("catch");
      console.log(error);

      if (error.response) {
        const errorMessage = error.response.data.error || 'An error occurred during profile update.';
        setError(errorMessage);
      } else {
        setError('An error occurred during profile update..');
      }
    }
  };

  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000, // Durée d'une rotation complète en millisecondes
        useNativeDriver: true,
        easing: Easing.linear

      })
    ).start();
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();  // Appeler l'API pour obtenir les informations utilisateur à chaque fois que l'écran est focalisé
    }
    startRotationAnimation();
  }, [isFocused]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const avatarUrl = userData ? `${config.apiUrl}/images/avatar/${userData.imageName}` : null; 
  const decorUrl = `${config.apiUrl}/images/design/circle2.png`;
  
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}> 
      <ImageBackground
        source={require('../assets/design/backgroundProfile.jpg')}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width:'100%'}}>
        <SafeAreaView style={styles.globalContainer}>
          <View style={styles.container}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.profileImage}
              accessible={true}
              accessibilityLabel="User's profile picture"
              accessibilityHint="This is your current profile picture"
            />              
            <Animated.Image
              source={{ uri: decorUrl }}
              style={[
                styles.circleImg,
                { transform: [{ rotate: spin }] }
              ]}
              accessible={true}
              accessibilityLabel="Decorative image"
              accessibilityHint="This is a decorative element"
            />
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
                accessibilityLabel="Change profile picture"
                accessibilityHint="Tap to select a new profile picture"
              >
                <Text>{profilePicture ? profilePicture.name : 'Change Profile Picture'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons 
                name={"person-outline"}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput 
                value={username}
                onChangeText={text => setUsername(text)}
                accessible={true}
                accessibilityLabel="Username input"
                accessibilityHint="Enter your username"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons 
                name={"mail-outline"}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput 
                value={email}
                onChangeText={text => setEmail(text)}
                accessible={true}
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons 
                name={"lock-closed-outline"}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput 
                placeholder='Enter new password'
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                accessible={true}
                accessibilityLabel="New password input"
                accessibilityHint="Enter a new password for your account"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons 
                name={"lock-closed-outline"}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput 
                placeholder='Repeat password'
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry={true}
                accessible={true}
                accessibilityLabel="Confirm password input"
                accessibilityHint="Repeat your new password for confirmation"
              />
            </View>
            <View style={styles.globalButtonBox}>
                <MyButton
                  onPress={HandleUpdateProfile}
                  style={styles.submitButton}
                  accessible={true}
                  accessibilityLabel="Update profile button"
                  accessibilityHint="Tap to save your changes"
                >
                  Update
                </MyButton>

                {error ? <Text style={globalStyles.warning} >{error}</Text> : null}

            </View>
          </View>
        </SafeAreaView>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default EditProfileScreen

const styles = StyleSheet.create({
  safeArea:{
    flex: 1,
  },
  loadingSafeArea:{
    flex: 1,
    backgroundColor: colors.web_black, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  globalContainer : {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '80%',
    height: '83%',
    borderRadius: 20,
    borderColor: colors.cyan,
    borderWidth: 2,
    marginTop: 30,
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
    marginBottom: 150
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    color: colors.web_white
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 70,
    zIndex:2,
    position: "absolute",
    top : 0,
    marginTop: 41
  },
  circleImg: {
    width: 170,
    height: 170,
    position: "relative",
    marginTop: 20,
    marginBottom: 10
  },
  secondButton:{
    width: 150,
    margin: 0,
    color: colors.web_black
  },
  submitButton:{
    height: 50,
    width: 130,
    marginTop: 25
  },
  userButtonBox:{
    display:"flex",
    flexDirection: "row",
    marginBottom: 20,
    height: 50,
    gap: 15
  },
  globalButtonBox:{
    display:"flex",
    alignItems:'center',
  },
  inputContainer:{
    marginVertical: 15,
    alignItems: "center",
    flexDirection: 'row',
    width: '80%',
    height:40,
    backgroundColor: colors.web_white,
    borderRadius:10,
    borderWidth: 1
  },
  inputIcon:{
    margin:7
  },
})