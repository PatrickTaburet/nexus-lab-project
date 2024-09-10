import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar,View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from './src/utils/fonts'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/navigation/AuthContext';
import {jwtDecode} from 'jwt-decode';

SplashScreen.preventAutoHideAsync();

const Main = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('token 1 ' + token)
        if (token) {
          let decodedToken;
          try {
            decodedToken = jwtDecode(token);
            console.log('token 2 goodd')

          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            await handleLogout();
            setLoading(false);
            return;
          }
          if (decodedToken.exp * 1000 >= Date.now()) {
            setIsLoggedIn(true);
            console.log('token 3 goodd')
          } else {
            await handleLogout();
            console.log('token 3 logout')
          }
        } else {
          setIsLoggedIn(false);
          console.log('token 4 falsee')
        } 
      } catch (error) {
        console.error('Error checking user token:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserToken();
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
