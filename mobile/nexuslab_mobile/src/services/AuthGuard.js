import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const AuthGuard = ({ children }) => {
  const navigation = useNavigation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'Welcome' },
              ],
            })
          );
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Welcome' },
            ],
          })
        );
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigation]);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
};

export default AuthGuard;