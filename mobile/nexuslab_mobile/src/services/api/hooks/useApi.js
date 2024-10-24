  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import config from '../../../config/config';
  import { checkTokenValidity } from '../../AuthService';
  import { useAuth } from '../../../navigation/AuthContext';

  const useApi = () => {
    // Gestion de l'authentification
    const { setIsLoggedIn, handleLogout } = useAuth();

    // Création de l'instance Axios avec la base URL
    const api = axios.create({
      baseURL: `${config.apiUrl}/api`,
    });

    // Intercepte chaque requête pour ajouter le token si disponible
    api.interceptors.request.use(async config => {
      if (config.url === '/login_check') {
        return config;
      }
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercepte les réponses pour gérer les erreurs, notamment l'expiration du token
    api.interceptors.response.use(
      (response) => response, 
      async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url === '/login_check') {
          return Promise.reject(error);
        }
        
        // Si le token est expiré (401), tente de le rafraîchir
        if (error.response && error.response.status === 401  && !originalRequest._retry) {
          originalRequest._retry = true;

          // Rafraîchit le token et renvoie la requête originale avec le nouveau token, sinon logout
          const newToken = await checkTokenValidity(handleLogout, setIsLoggedIn);
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest); 
          } else {
            await handleLogout();
          }
        }
        return Promise.reject(error);
      }
    );

    return {
      api,
    };
  };

  export default useApi;