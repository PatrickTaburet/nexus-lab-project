import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../navigation/AuthContext';


const AuthGuard = ({ children }) => {
  const { setIsLoggedIn, handleLogout } = useAuth();
  const navigation = useNavigation();

  const validateToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Token validation failed:', error.message || error);
      handleLogout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return children;
};


export default AuthGuard;