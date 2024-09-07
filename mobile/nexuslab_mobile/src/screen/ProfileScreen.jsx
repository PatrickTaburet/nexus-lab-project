import { View, Text, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import React, { useState, useEffect } from 'react'
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import {jwtDecode} from 'jwt-decode';
import config from '../config/config'; 


const ProfileScreen = ({ navigation, setIsLoggedIn })  => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

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

  useEffect(() => {
    if (isFocused) {
      fetchUserData();  // Appeler l'API pour obtenir les informations utilisateur à chaque fois que l'écran est focalisé
    }
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

  const imageUrl = userData ? `${config.apiUrl}/images/avatar/${userData.imageName}` : null; 

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
              source={{ uri: imageUrl }}
              style={styles.profileImage}
            />
            <Text style={styles.text}>Pseudo : {userData.pseudo}</Text>
            <Text style={styles.text}>Email: {userData.email}</Text>
            <Text style={styles.text}>Role: {userData.roles}</Text>
            {/* Ajoutez d'autres champs utilisateur ici */}
          </>
        ) : (
          <Text style={styles.text}>Aucune donnée utilisateur disponible</Text>
        )}
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
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
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    margin: 20,
  },
})