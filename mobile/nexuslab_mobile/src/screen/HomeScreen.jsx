import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ setIsLoggedIn })  => {
  const navigation = useNavigation();
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
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur HomeScreen!</Text>

        <Button title="Logout" onPress={handleLogout} />
      </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
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