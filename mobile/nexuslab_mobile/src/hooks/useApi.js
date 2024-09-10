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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - possibly due to invalid token or session");
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

  const signup = async (userData) => {
    try {
      const response = await api.post('/users', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Relancer l'erreur pour la gérer dans le composant appelant
    }
  };

  return {
    api,
    signup,
  };
};

export default useApi;