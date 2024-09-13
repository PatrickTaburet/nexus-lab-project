import { useAuth } from '../navigation/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';
import { checkTokenValidity } from '../services/AuthService';


const useApi = () => {
  const { setIsLoggedIn, handleLogout } = useAuth();

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
      const originalRequest = error.config;

      if (error.response && error.response.status === 401  && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log(error.config);
        const newToken = await checkTokenValidity(handleLogout, setIsLoggedIn);
        if (newToken) {
          console.log("token épuisé pour la requete : refresh et renvoi de la requete");
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
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