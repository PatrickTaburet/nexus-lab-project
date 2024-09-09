// src/hooks/useApi.js
import { useAuth } from '../navigation/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';
import { CommonActions } from '@react-navigation/native';

const useApi = () => {
  const { setIsLoggedIn } = useAuth();
  const navigation = useNavigation();

  const api = axios.create({
    baseURL: `${config.apiUrl}/api`,
  });

  api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    console.log("api token : " + token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          })
        );
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useApi;