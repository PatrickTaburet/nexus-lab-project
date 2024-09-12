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

  const refreshAccessToken = async (username) => {
    try {
      console.log("--------------");
      console.log( username);

      const response = await api.post('/refresh_token', { username: username }, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      const { token } = response.data;
      console.log('Req pass');
      console.log('Nouveau token:', token);
      console.log('refresh response : ' + response.data);
      if (token) {
        return token;
      } else {
        console.error('Échec du rafraîchissement du tokenn:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  useEffect(() => {
    //AsyncStorage.removeItem('token');

    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        console.log('token 1 ' + token)
        if (token) {
          let decodedToken;
          let username;
          try {
            decodedToken = jwtDecode(token);
            username = decodedToken.username;
            console.log('token 2 good ' + username )
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            await handleLogout();
            setLoading(false);
            return;
          }

          if (decodedToken.exp * 1000 >= Date.now()) {
            setIsLoggedIn(true);
            console.log('token 3 good')
          } else if (refreshToken){
            console.log('token 3 refreshh')
            const newToken = await refreshAccessToken(username);
            if (newToken) {
              await AsyncStorage.setItem('token', newToken);
              console.log('newtoken---' + newToken)
              setIsLoggedIn(true);
            } else {
              console.log("expired token and try to refresh")
              await handleLogout();
            }
          } else {
            console.log("expired token and no refreshh")
            await handleLogout();
          }
        } else {
          await handleLogout();
          console.log('token 4 false')
        } 
      } catch (error) {
        console.error('Error checking user tokenn:', error);
        await handleLogout();
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
