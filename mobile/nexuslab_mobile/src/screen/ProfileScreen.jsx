import { View, Text, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image, Animated, Easing } from 'react-native';
import React, { useState, useEffect } from 'react'
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import {jwtDecode} from 'jwt-decode';
import config from '../config/config'; 
import { colors } from '../utils/colors'
import MyButton from '../components/MyButton';
import globalStyles from '../utils/styles';

const ProfileScreen = ({ navigation, setIsLoggedIn })  => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [rotation] = useState(new Animated.Value(0));

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
      console.log(response.data);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    } finally {
      setLoading(false);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Welcome' },
          ],
        })
      );
    } catch (err) {
      console.log('Erreur lors de la déconnexion:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.text}>Chargement...</Text>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={38} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
         {userData ? (
          <>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.profileImage}
            />
                      
            <Animated.Image
              source={{ uri: decorUrl }}
              style={[
                styles.circleImg,
                { transform: [{ rotate: spin }] }
              ]}
            />
            <Text style={styles.text}>Pseudo : {userData.pseudo}</Text>
            <Text style={styles.text}>Email: {userData.email}</Text>
            <Text style={styles.text}>Role: {userData.roles}</Text>
            {/* Ajoutez d'autres champs utilisateur ici */}
          </>
        ) : (
          <Text style={styles.text}>Aucune donnée utilisateur disponible</Text>
        )}
        <View style={styles.globalButtonBox}>
          <View style={styles.userButtonBox}>
            <MyButton
              // HandlePress={}
              myStyle={styles.submitButton}
            >
              Edit Profile
            </MyButton>
            <MyButton
              // HandlePress={}
              myStyle={styles.submitButton}
            >
              My Artwork
            </MyButton>
          </View>
          <MyButton
            // HandlePress={}
            myStyle={styles.secondButton}
            isSecondary={true} 
          >
            Artist Dashboard
          </MyButton>
        </View>
       
        <MyButton
          // HandlePress={}
          myStyle={styles.secondButton}
          isSecondary={true} 
        >
          Admin Dashboard
        </MyButton>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.logoutText, globalStyles.text3]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    marginRight: 23,
    marginTop: 35
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    gap: 15
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  logoutText:{
    fontSize: 23,
    color: colors.primary
  },
  profileImage: {
    width: 127,
    height: 127,
    borderRadius: 70,
    zIndex:2,
    marginBottom: 10,
    marginTop: 50
  },
  circleImg:{
    width: 170,
    height: 170,
    position: "absolute",
    top : 15,
    marginBottom: 30
  },
  secondButton:{
    width: 150,
    margin: 0,
    color: 'black'
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
  }
})