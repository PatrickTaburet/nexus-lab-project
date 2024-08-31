import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from './src/utils/fonts'; 
import {useEffect, useState} from 'react';
import { globalStyles } from './src/utils/styles';  
import WelcomeScreen from './src/screen/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGuard from './src/services/AuthGuard'; 

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const AuthNavigator = ({ isLoggedIn, setIsLoggedIn })  => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? "Home" : "Welcome"}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Home">
            {(props) => (
              <AuthGuard>
                <HomeScreen {...props} setIsLoggedIn={setIsLoggedIn} />
              </AuthGuard>
              )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useCustomFonts();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // console.log("is logged : " + isLoggedIn);
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
