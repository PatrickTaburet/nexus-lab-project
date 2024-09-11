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

SplashScreen.preventAutoHideAsync();

const Main = () => {
  const { isLoggedIn, setIsLoggedIn, handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const {api} = useApi();

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await api.post('/refresh_token', { refresh_token: refreshToken }, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      const { token, refresh_token } = response.data;
      console.log('Nouveau token:', token);
      console.log('refresh response : ' + response.data);
      if (token) {
        return token;
      } else {
        console.error('Échec du rafraîchissement du token:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  useEffect(() => {
    //  AsyncStorage.removeItem('token');

    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        console.log('token 1 ' + token)
        if (token) {
          let decodedToken;
          try {
            decodedToken = jwtDecode(token);
            console.log('token 2 good')
          } catch (decodeError) {
            console.error('Error decoding tokennn:', decodeError);
            await handleLogout();
            setLoading(false);
            return;
          }

          if (decodedToken.exp * 1000 >= Date.now()) {
            setIsLoggedIn(true);
            console.log('token 3 good')
          } else if (refreshToken){
            console.log('token 3 refresh')
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
              await AsyncStorage.setItem('token', newToken);
              console.log('newtoken---')

              setIsLoggedIn(true);
            } else {
              await handleLogout();
            }
          } else {
            await handleLogout();
          }
        } else {
          setIsLoggedIn(false);
          console.log('token 4 false')
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
