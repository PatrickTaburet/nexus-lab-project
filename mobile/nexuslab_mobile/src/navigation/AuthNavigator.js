import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screen/auth/WelcomeScreen';
import LoginScreen from '../screen/auth/LoginScreen';
import SignupScreen from '../screen/auth/SignupScreen';
import AuthGuard from '../services/AuthGuard';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({ isLoggedIn, setIsLoggedIn })  => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen name="TabNavigator">
            {(props) => (
              <AuthGuard>
                <MainNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
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

export default AuthNavigator;
