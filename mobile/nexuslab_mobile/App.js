import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from './src/utils/fonts'; 
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useCustomFonts();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        // console.log('Stored token:', token);
        setIsLoggedIn(!!token); // Convertit le token en booléen (true si présent, false si absent)
      } catch (error) {
        console.error('Error checking user token:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserToken();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

 if (loading || !fontsLoaded) {
    return null; 
  }
  
  return (
    <NavigationContainer>
      <AuthNavigator isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  />
    </NavigationContainer>
  );
} 

const styles = StyleSheet.create({
});
