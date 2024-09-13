import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
// import useApi from '../hooks/use';  // Importez votre hook API
// import { useAuth } from '../navigation/AuthContext';
import { refreshTokenApi } from '../api/authApi';


export const refreshAccessToken = async (username) => {
  try {
    const response = await refreshTokenApi(username);
    const { token } = response.data;
    return token ? token : null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const checkTokenValidity = async (handleLogout, setIsLoggedIn) => {
  try {
    const token = await AsyncStorage.getItem('token');

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
          console.log("Refresh ok : new token added in localstorage");
          setIsLoggedIn(true);
          return newToken;
        } else {
          await handleLogout();
        }
      }
    } else  {
      console.error('Token is null or undefined');
      await handleLogout();
      return;
    }
  } catch (error) {
    console.error('Error checking token validity:', error); 
    await handleLogout();
  }
};
