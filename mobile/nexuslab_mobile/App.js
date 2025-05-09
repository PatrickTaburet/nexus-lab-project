import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar,View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from './src/utils/fonts'; 
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/navigation/AuthContext';
import { checkTokenValidity } from './src/services/AuthService';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colors} from './src/utils/colors'

SplashScreen.preventAutoHideAsync();

const Main = () => { 
  const { isLoggedIn, setIsLoggedIn, handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("start app");
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
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <AuthNavigator isLoggedIn={isLoggedIn}/>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default function App() {
  const [fontsLoaded] = useCustomFonts();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(colors.web_black);
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
