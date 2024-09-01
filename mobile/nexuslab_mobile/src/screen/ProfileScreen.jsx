import { View, Text, Button, StyleSheet, TouchableOpacity, SafeAreaView  } from 'react-native';
import React from 'react'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation, setIsLoggedIn })  => {

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={38} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur ProfileScreen!</Text>
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


})