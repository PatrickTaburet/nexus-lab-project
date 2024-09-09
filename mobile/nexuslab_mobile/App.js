import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from './src/utils/fonts'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/navigation/AuthContext';

SplashScreen.preventAutoHideAsync();

const Main = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token); // Convertit le token en booléen (true si présent, false si absent)
      } catch (error) {
        console.error('Error checking user token:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserToken();
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <AuthNavigator isLoggedIn={isLoggedIn}/>
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useCustomFonts();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('black'); // ou Transparent
    StatusBar.setTranslucent(true);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Main/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
