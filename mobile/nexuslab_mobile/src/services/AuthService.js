import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
// import useApi from '../hooks/use';  // Importez votre hook API
// import { useAuth } from '../navigation/AuthContext'; 
import { refreshTokenApi } from '../api/authApi';


const refreshAccessToken = async (userId) => {
  try {
    const response = await refreshTokenApi(userId);
    const { token } = response.data;
    return token ? token : null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const checkTokenValidity = async (handleLogout, setIsLoggedIn, email = null) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      let decodedToken;
      let userId;
      let tokenEmail; 
      try {
        decodedToken = jwtDecode(token);
        userId = decodedToken.id;
        tokenEmail = decodedToken.username;
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        await handleLogout();
        return;
      }
      
      if (decodedToken.exp * 1000 >= Date.now() && tokenEmail == email) {
        setIsLoggedIn(true);
        console.log('Token actuel valide');
        return token;
      } else  {
        const newToken = await refreshAccessToken(userId);
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
