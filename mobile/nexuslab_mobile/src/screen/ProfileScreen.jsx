import { ImageBackground, View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Image, Animated, Easing } from 'react-native';
import React, { useState, useEffect } from 'react'
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
// import api from '../services/api';
import {jwtDecode} from 'jwt-decode';
import config from '../config/config'; 
import { colors } from '../utils/colors'
import MyButton from '../components/MyButton';
import globalStyles from '../utils/styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useApi from '../services/api/hooks/useApi';
import { useAuth } from '../navigation/AuthContext';

const ProfileScreen = ({ navigation })  => {

  const {api} = useApi();
  const {isLoggedIn, handleLogout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [rotation] = useState(new Animated.Value(0));

  const fetchUserData = async () => {
   
    try {
      const token = await AsyncStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      console.log(userId);
      const response = await api.get(`/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      //console.log(response.data);
      
      setUserData(response.data); 
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const onLogoutPress = async () => {
    await handleLogout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      })
    );
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

  const getContainerHeight = () => {
 
    if (!userData) return '83%'; 

    let height = '70%'; // Hauteur minimale par défaut

    if (userData.roles[1] || userData.roles[2]) {
      height = '75%'; // Augmentez la hauteur si un des rôles est présent
    }
    if (userData.roles[1] && userData.roles[2]) {
      height = '83%'; // Hauteur maximale si les deux rôles sont présents
    }

    return height;
  };
  return (
    <SafeAreaView style={styles.safeArea}> 
    <ImageBackground
      source={require('../assets/design/backgroundProfile.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton} accessible={true} accessibilityLabel="Close">
        <Ionicons name="close" size={38} color="white"/>
      </TouchableOpacity>
    </View>
    <SafeAreaView style={[styles.globalContainer, { height: getContainerHeight() }]}>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.editButton} accessible={true} accessibilityLabel="Edit Profile">
        <FontAwesome5 name="user-edit" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
         {userData && Object.keys(userData).length > 0  ? (
          <>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.profileImage}
              accessible={true}
              accessibilityLabel={`Profile picture of ${userData.pseudo}`}
            />
                      
            <Animated.Image
              source={{ uri: decorUrl }}
              style={[
                styles.circleImg,
                { transform: [{ rotate: spin }] }
              ]}
              accessible={true}
              accessibilityLabel="Decorative animated image"
            />
            <Text style={styles.text} accessible={true} accessibilityLabel={`Pseudo: ${userData.pseudo}`}>Pseudo: {userData.pseudo}</Text>
            <Text style={styles.text} accessible={true} accessibilityLabel={`Email: ${userData.email}`}>Email: {userData.email}</Text>
            <Text style={styles.text} accessible={true} accessibilityLabel={`Role: ${userData.roles.join(', ')}`}>
              Role: {userData.roles[0] ? "USER" : ""}{userData.roles[1] ? " / ARTIST" : ""}{userData.roles[2] ? " / ADMIN" : ""}
            </Text>
          </>
        ) : (
          <Text style={styles.text} accessible={true} accessibilityLabel="No user data available">No user data available</Text>
        )}
        <View style={styles.globalButtonBox}>
          <View style={styles.userButtonBox}>
            <MyButton
              onPress={() => {navigation.navigate("MyArtworks")}}
              textStyle = {{fontSize: 16}}
              accessible={true}
              accessibilityLabel="Navigate to My Artworks"
            >
              My Artworks
            </MyButton>
          </View>
          {userData && userData.roles[1] ? (
            <MyButton
              // onPress={}
              isSecondary={true}
              accessible={true}
              accessibilityLabel="Navigate to Artist Dashboard"
            >
              Artist Dashboard
            </MyButton>
          ) : null }
        </View>
        {userData &&userData.roles[2] ? (
          <MyButton
            // onPress={}
            isSecondary={true} 
            accessible={true}
            accessibilityLabel="Navigate to Admin Dashboard"
          >
            Admin Dashboard
          </MyButton>
        ) : null}
        <TouchableOpacity onPress={onLogoutPress} accessible={true} accessibilityLabel="Logout">
          <Text style={[styles.logoutText, globalStyles.text3]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ImageBackground>
    </SafeAreaView>

  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,   
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea:{
    flex: 1,
    backgroundColor: colors.web_black, 
  },
  loadingSafeArea:{
    flex: 1,
    backgroundColor: colors.web_black, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width:'100%',
    marginVertical: 70,
    flex: 1,
    alignItems: 'center',
  },
  globalContainer : {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '80%',
    height: '83%',
    borderRadius: 20,
    borderColor: colors.cyan,
    borderWidth: 2,
    marginTop: 0
  },
  header: {
    width:'100%',
    position: 'absolute',
    top: 47
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: -40,
  },
  editButton:{
    width: 'auto',
    display:"flex",
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 150,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    color: colors.web_white
  },
  logoutText:{
    fontSize: 23,
    color: colors.primary,
    marginTop: 0,
    marginBottom: 15
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 70,
    zIndex:2,
    position: "relative",
    top : 161,

  },
  circleImg:{
    width: 170,
    height: 170,
    position: "relative",
  },
  secondButton:{
    width: 150,
    margin: 0,
    color: colors.web_black
  },
  submitButton:{
    margin: 0,
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

})