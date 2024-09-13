import { useAuth } from '../navigation/AuthContext';
// import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';
// import {CommonActions} from '@react-navigation/native';
import useAuthService from '../services/AuthService';
import { checkTokenValidity } from '../services/AuthService';


const useApi = () => {
  // const { checkTokenValidity } = useAuthService(); // Utilisation du service d'authentification
  const { setIsLoggedIn, handleLogout } = useAuth();

  const api = axios.create({
    baseURL: `${config.apiUrl}/api`,
  });

  api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    if (token && !config.url.includes('/refresh_token')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401  && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log(error.config);
        console.log('before refresh token in api');
        const newToken = await checkTokenValidity(handleLogout, setIsLoggedIn);
        console.log(newToken);
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('before new api after refresh');
          return api(originalRequest); 
        } else {
          await handleLogout();
        }
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
      throw error; // Relancer l'erreur pour la gérer dans le composant appelant.
    }
  };

  return {
    api,
    signup,
  };
};

export default useApi;