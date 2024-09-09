import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';

const AuthGuard = ({ children, setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("token : " + token)
        if (!token) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            })
          );
          return;
        }

        // const decodedToken = jwtDecode(token);
        // const currentTime = Date.now() / 1000;
        
        // if (decodedToken.exp < currentTime) {
        //   await AsyncStorage.removeItem('token');
        //   navigation.dispatch(
        //     CommonActions.reset({
        //       index: 0,
        //       routes: [{ name: 'Welcome' }],
        //     })
        //   );
        //   return;
        // }
        setIsLoggedIn(true);
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
  }, [navigation, setIsLoggedIn]);

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