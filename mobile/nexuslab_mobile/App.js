import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar,View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from './src/utils/fonts'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/navigation/AuthContext';
import {jwtDecode} from 'jwt-decode';
import useApi from './src/hooks/useApi';
// import useAuthService from './src/services/AuthService';
import { checkTokenValidity } from './src/services/AuthService';

SplashScreen.preventAutoHideAsync();

const Main = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  // const { checkTokenValidity } = useAuthService();
  // const {api} = useApi(checkTokenValidity);


  useEffect(() => {
    const initializeAuth = async () => {
      await checkTokenValidity(handleLogout, setIsLoggedIn);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ); 
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
