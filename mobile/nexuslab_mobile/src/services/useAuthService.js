import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import useApi from '../hooks/useApi';  // Importez votre hook API
import { useAuth } from '../navigation/AuthContext';

const useAuthService = () => {
  const { api } = useApi();
  const {setIsLoggedIn, handleLogout  } = useAuth();

  const refreshAccessToken = async (username) => {
    try {
      console.log('before req refresh');
        const response = await api.post('/refresh_token', { username: username }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { token } = response.data;
        console.log('Nouveau token:', token);
        if (token) {
            await AsyncStorage.setItem('token', token);
            return token;
        }
        return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  const checkTokenValidity = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Ancien token:', token);
      if (token) {
        let decodedToken;
        let username;
        try {
          decodedToken = jwtDecode(token);
          username = decodedToken.username;
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          await handleLogout();
          return;
        }

        if (decodedToken.exp * 1000 >= Date.now()) {
            setIsLoggedIn(true);
            console.log('Token actuel valide');
        } else  {
          const newToken = await refreshAccessToken(username);
          if (newToken) {
            await AsyncStorage.setItem('token', newToken);
            setIsLoggedIn(true);
          } else {
            await handleLogout();
          }
        }
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
      await handleLogout();
    }
  };


  return {
    checkTokenValidity,
  };
};

export default useAuthService;
