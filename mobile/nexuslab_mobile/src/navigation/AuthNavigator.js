import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screen/auth/WelcomeScreen';
import LoginScreen from '../screen/auth/LoginScreen';
import SignupScreen from '../screen/auth/SignupScreen';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({ isLoggedIn })  => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      {isLoggedIn ? (
        <>
         <Stack.Screen name="TabNavigator" component={MainNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{
              accessibilityLabel: 'Welcome screen, to login or signup.',
            }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              accessibilityLabel: 'Authentification screen, login to continue',
            }} 
           />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen}
            options={{
              accessibilityLabel: 'Registration screen, fill the form to create an account',
            }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
